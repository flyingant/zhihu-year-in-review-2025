'use client';

import { useEffect, useRef } from 'react';

interface PixelFireworksProps {
  /** 延迟播放时间 (毫秒) */
  delay?: number;
  /** 粒子数量 */
  particleCount?: number;
  /** 粒子颜色数组 */
  colors?: string[];
  
  /** 
   * 初始高度区间下限 (像素，相对于屏幕顶部) 
   * 负数表示在屏幕上方
   * 默认 -150
   */
  minStartY?: number;
  
  /** 
   * 初始高度区间上限 (像素，相对于屏幕顶部)
   * 默认 0 (刚好在屏幕边缘)
   */
  maxStartY?: number;
}

const DEFAULT_COLORS = [
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', 
  '#B5EAD7', '#C7CEEA', '#FFD700', '#81C784',
  '#FF6EA9', '#68E1FD'
];

interface Particle {
  x: number;      // 当前 X 坐标
  y: number;      // 当前 Y 坐标
  baseX: number;  // 基础 X 坐标（用于计算左右摇摆的中心轴）
  vy: number;     // (Velocity Y) 垂直下落速度
  color: string;  // 颜色
  size: number;   // 大小
  rotation: number;       // 当前旋转角度
  rotationSpeed: number;  // 旋转速度
  oscillationOffset: number; // 左右摇摆的起始相位（让每个彩带摇摆节奏不一样）
  oscillationSpeed: number;  // 左右摇摆的频率（摇得有多快）
  swayAmount: number;        // 左右摇摆的幅度（摇得有多宽）
}

export default function PixelFireworks({
  delay = 0,
  particleCount = 80,
  colors = DEFAULT_COLORS,
  // 默认从屏幕上方 150px 到 0px 的区域生成，形成密集的一波
  minStartY = -150, 
  maxStartY = 0,
}: PixelFireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 初始化粒子：在指定的 Y 轴区间内生成
    const initParticles = () => {
      const particles: Particle[] = [];
      const width = canvas.width;
      
      // 计算生成的高度范围
      const yRange = maxStartY - minStartY;

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        // Y 轴位置：用户指定的区间内随机
        const y = minStartY + Math.random() * yRange;

        particles.push({
          x: x,
          baseX: x,
          y: y,
          
          // 下落速度：随机在 1.5 到 3.5 之间
          vy: 1.5 + Math.random() * 2.0, 
          
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 5,
           // 旋转逻辑
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 3, 
          // 摇摆逻辑：正弦波运动参数
          oscillationOffset: Math.random() * Math.PI * 2,
          oscillationSpeed: 0.03 + Math.random() * 0.03,
          swayAmount: 15 + Math.random() * 20, // 左右摇摆幅度 15px - 35px
        });
      }
      particlesRef.current = particles;
    };

    const render = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      let activeCount = 0;
      const boundary = canvas.height + 20;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.y <= boundary) {
          activeCount++;

          // 物理更新
          p.y += p.vy; // 匀速下落

          // 左右摇摆
          p.oscillationOffset += p.oscillationSpeed;
          p.x = p.baseX + Math.sin(p.oscillationOffset) * p.swayAmount;

          // 旋转
          p.rotation += p.rotationSpeed;

          // 绘制
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5); 
          ctx.restore();
        }
      }

      if (activeCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        isFinishedRef.current = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    let timer: NodeJS.Timeout;
    if (delay === 0) {
      initParticles();
      render();
    } else {
      timer = setTimeout(() => {
        if (!isFinishedRef.current) {
          initParticles();
          render();
        }
      }, delay);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(timer);
    };
  }, [delay, particleCount, colors, minStartY, maxStartY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
      style={{ touchAction: 'none' }}
    />
  );
}