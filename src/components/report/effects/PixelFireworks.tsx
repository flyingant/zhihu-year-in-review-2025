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
  '#FF9AA2',
  '#FFB7B2',
  '#FFDAC1',
  '#E2F0CB',
  '#B5EAD7',
  '#C7CEEA',
  '#FFD700',
  '#81C784',
  '#FF6EA9',
  '#68E1FD',
];

interface Particle {
  x: number; // 当前 X 坐标
  y: number; // 当前 Y 坐标
  vx: number; // (Velocity X) 水平速度
  vy: number; // (Velocity Y) 垂直速度
  color: string; // 颜色
  size: number; // 大小
  rotation: number; // 当前旋转角度
  rotationSpeed: number; // 旋转速度
  opacity: number; // 透明度
  gravity: number; // 重力
  life: number; // 生命值 (0-1)
  decay: number; // 衰减速度
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
    if (!canvas) {
      console.error('PixelFireworks: Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('PixelFireworks: Could not get 2d context');
      return;
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(
        'PixelFireworks: Canvas resized to',
        canvas.width,
        'x',
        canvas.height
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 初始化粒子：从两边向外炸开
    const initParticles = () => {
      const particles: Particle[] = [];
      const width = canvas.width;
      const height = canvas.height;

      const centerY = height / 2;

      console.log('PixelFireworks: Initializing', particleCount, 'particles');
      console.log('PixelFireworks: Canvas size:', width, 'x', height);

      for (let i = 0; i < particleCount; i++) {
        // 一半粒子从左边，一半从右边
        const isFromLeft = i < particleCount / 2;

        // 起始位置：从屏幕边缘开始，垂直中间
        const startX = isFromLeft ? 0 : width; // 从屏幕边缘开始
        const startY = centerY; // 固定在垂直中间，从一个点炸开

        // 爆炸角度：向上45度角炸开
        // 左边向右上45度，右边向左上45度
        const baseAngle = isFromLeft ? -Math.PI / 4 : (-3 * Math.PI) / 4; // -45度 和 -135度
        const angleSpread = Math.PI * 0.66; // 扩散角度范围120度，形成扇形
        const angle = baseAngle + (Math.random() - 0.5) * angleSpread;

        // 速度：增加速度让粒子水平扩散更明显
        const speed = 6 + Math.random() * 7; // 增加到4-8
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
          x: startX,
          y: startY,
          vx: vx,
          vy: vy,

          color: colors[Math.floor(Math.random() * colors.length)],
          size: width * (0.016 + Math.random() * 0.013), // 基于屏幕宽度的1.6%-2.9%

          // 旋转逻辑
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 6,

          // 透明度和生命值 (更长的生命周期)
          opacity: 1,
          life: 1,
          decay: 0.003 + Math.random() * 0.003, // 更慢的衰减

          // 重力 (减小重力，让水平运动更明显)
          gravity: 0.05 + Math.random() * 0.03,
        });
      }
      particlesRef.current = particles;
      console.log(
        'PixelFireworks: Particles initialized, first particle:',
        particles[0]
      );
    };

    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.life > 0) {
          activeCount++;

          // 物理更新
          p.vy += p.gravity; // 应用重力
          p.x += p.vx;
          p.y += p.vy;

          // 空气阻力
          p.vx *= 0.98;
          p.vy *= 0.98;

          // 生命值衰减
          p.life -= p.decay;
          p.opacity = Math.max(0, p.life);

          // 旋转
          p.rotation += p.rotationSpeed;

          // 绘制
          if (p.opacity > 0) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5); // 原始长方形
            ctx.restore();
          }
        }
      }

      if (activeCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        isFinishedRef.current = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('PixelFireworks: Animation finished');
      }
    };

    let timer: NodeJS.Timeout;
    if (delay === 0) {
      console.log('PixelFireworks: Starting immediately');
      initParticles();
      render();
    } else {
      console.log('PixelFireworks: Starting after', delay, 'ms delay');
      timer = setTimeout(() => {
        if (!isFinishedRef.current) {
          console.log('PixelFireworks: Delay finished, starting animation');
          initParticles();
          render();
        }
      }, delay);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(timer);
      console.log('PixelFireworks: Cleanup');
    };
  }, [delay, particleCount, colors, minStartY, maxStartY]);

  return (
    <canvas
      ref={canvasRef}
      className='absolute top-0 left-0 w-full h-full pointer-events-none'
      style={{
        touchAction: 'none',
        zIndex: 9999, // 确保在最上层
        backgroundColor: 'transparent',
      }}
    />
  );
}
