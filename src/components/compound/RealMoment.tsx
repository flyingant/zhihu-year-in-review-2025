"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import { useAssets } from '@/context/assets-context';


const MOMENTS = [
  "手写信和桂花酒。", "春天，我亲眼看见种子发芽。", "朋友记住了我不喜欢吃香菜。", "深夜下班，同事递来的糖。", "第一次在此刻看到了极光。",
  "风天，和朋友勇闯游乐园。", "夏夜小雨，开心地踩水。", "在异乡出差，吃到童年的味道。", "随手拍的树，被设成了壁纸。", "猫咪第一次主动蹭了我的手。",
  "帮奶奶修好了收音机。", "耳机里正好播到最爱的那首歌。", "在这个路口，等到了绿灯。", "做了一顿不算翻车的晚饭。", "收到了一束没有署名的花。",
  "通宵改的方案，客户说一次过。", "地铁上有人给老人让座。", "久未联系的老友突然打来电话。", "发现了一家超好吃的苍蝇馆子。", "周末睡到自然醒，阳光刚好。",
  "在旧书里翻到一张老照片。", "下班路上看到了粉色的晚霞。", "虽然淋了雨，但看见了彩虹。", "被陌生人夸奖今天的穿搭。", "学会了一项新技能。",
  "把购物车里的东西都清空了。", "父母身体健康，吃嘛嘛香。", "坚持运动了一个月。", "在知乎看到了一个很棒的回答。", "此刻，心情很平静。"
];

const ROWS_COUNT = 6;
const ITEMS_PER_ROW = 5;
const CHAR_SPACING_PERCENT = 0.8;

// 左右跨度（距离中心点的距离）
const PATH_SPREAD_FROM_CENTER = 1000;
// 垂直高度配置，网页坐标值是相反的，y越大，位置越靠下
const PATH_BASE_Y = 500; // 起点和终点的 Y 坐标 (下落的位置)
const PATH_PEAK_Y = -200;  // 中间顶点的 Y 坐标 (拱起的位置)

/**
 * 根据容器宽度生成对称的贝塞尔曲线路径
 * @param containerWidth 当前容器的宽度
 */
const generateCurvedPath = (containerWidth: number) => {
  const centerX = containerWidth / 2;
  const startX = centerX - PATH_SPREAD_FROM_CENTER;
  const endX = centerX + PATH_SPREAD_FROM_CENTER;

  // M: 起点
  // Q: 二次贝塞尔曲线 (控制点X 控制点Y 终点X 终点Y)
  return `path('M ${startX} ${PATH_BASE_Y} Q ${centerX} ${PATH_PEAK_Y} ${endX} ${PATH_BASE_Y}')`;
};

const wrapPercent = (value: number) => {
  return ((value % 100) + 100) % 100;
};

export default function CurveMarquee() {
  const { assets } = useAssets();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathString, setPathString] = useState(() => generateCurvedPath(430));
  const isMobile = useMobile();

  const progressRef = useRef(0);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const dragRef = useRef({
    startX: 0,
    startProgress: 0,
    isDragging: false,
  });


  const rowOffsets = React.useMemo(() => {
    return Array.from({ length: ROWS_COUNT }, () => Math.random() * 100);
  }, []);

  // 监听容器宽度变化,实现自适应居中
  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setPathString(generateCurvedPath(width));
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, []);

  useEffect(() => {
    const handleWindowMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();

      const deltaX = e.clientX - dragRef.current.startX;
      // 调整灵敏度
      const sensitivity = 0.15;

      const newProgress = dragRef.current.startProgress + (deltaX * sensitivity);
      progressRef.current = newProgress;
    };

    const resetDraggingState = () => {
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';

        // 松手时重置数值到 0-100 之间，防止数值无限增大导致精度丢失卡死
        progressRef.current = ((progressRef.current % 100) + 100) % 100;
      }
    };

    const handleWindowUp = () => {
      resetDraggingState();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetDraggingState();
      }
    };

    window.addEventListener('pointermove', handleWindowMove);
    window.addEventListener('pointerup', handleWindowUp);
    window.addEventListener('touchend', handleWindowUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', resetDraggingState);


    return () => {
      window.removeEventListener('pointermove', handleWindowMove);
      window.removeEventListener('pointerup', handleWindowUp);
      window.removeEventListener('touchend', handleWindowUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', resetDraggingState);
    };
  }, []);



  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      const currentGlobalProgress = progressRef.current;

      // 遍历所有缓存的 span 节点，直接更新样式
      spansRef.current.forEach((span) => {
        if (!span) return;

        // 从 data 属性中读取静态参数
        const baseRowOffset = parseFloat(span.dataset.baseOffset || "0");
        const charIndex = parseFloat(span.dataset.charIndex || "0");

        // 计算位置
        const currentPercent = baseRowOffset + currentGlobalProgress + (charIndex * CHAR_SPACING_PERCENT);
        const finalDistance = wrapPercent(currentPercent);
        const opacity = finalDistance < 5 || finalDistance > 95 ? 0 : 0.9;

        // offset-path 上面的属性
        span.style.offsetDistance = `${finalDistance}%`;
        span.style.opacity = opacity.toString();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // 启动渲染循环
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startProgress = progressRef.current;

    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };


  if (!assets) return null;

  const bgAsset = assets.realMoment.bg;

  const rows = Array.from({ length: ROWS_COUNT }, (_, i) => {
    const start = i * ITEMS_PER_ROW;
    const end = start + ITEMS_PER_ROW;
    if (end > MOMENTS.length) {
      return MOMENTS.slice(start).concat(MOMENTS.slice(0, end - MOMENTS.length));
    }
    return MOMENTS.slice(start, end);
  });

  spansRef.current = [];

  return (
    <div ref={containerRef} className="relative w-full max-w-[500px] mx-auto h-[500px] overflow-hidden bg-white touch-none"
      onPointerDown={handlePointerDown}>
      <div className="absolute inset-0 z-0">
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="object-cover"
          priority
        />
      </div>
      <div className={`relative w-full h-full ${isMobile ? '-mt-[25px]' : 'mt-[30px]'}`}>
        {rows.map((rowItems, rowIndex) => {
          const gap = isMobile ? 50 : 80;
          const rowTop = rowIndex * gap;
          const spacingStr = "　　　　　";
          const rowFullText = rowItems.join(spacingStr) + spacingStr;
          const baseRowOffset = rowOffsets[rowIndex];
          return (
            <div
              key={rowIndex}
              className="absolute left-0 w-full pointer-events-none"
              style={{
                top: `${rowTop}px`,
                height: "40px",
              }}
            >
              {rowFullText.split('').map((char, charIndex) => {
                return (
                  <span
                    key={charIndex}
                    ref={(el) => {
                      if (el) spansRef.current.push(el);
                    }}
                    data-base-offset={baseRowOffset}
                    data-char-index={charIndex}
                    className="absolute left-0 top-0 text-base text-[#333] font-medium curve-text-item will-change-transform"
                    style={{
                      offsetPath: pathString,
                      offsetDistance: `0%`,
                      whiteSpace: "pre",
                      fontVariantNumeric: "tabular-nums",
                      transition: 'none',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}