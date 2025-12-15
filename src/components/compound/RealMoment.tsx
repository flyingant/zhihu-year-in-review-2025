"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';


const ROWS_COUNT = 6;
const ITEMS_PER_ROW = 17;
const CHAR_SPACING_PERCENT = 0.3;

// 左右跨度（距离中心点的距离）
const PATH_SPREAD_FROM_CENTER = 2500;
// 垂直高度配置，网页坐标值是相反的，y越大，位置越靠下
const PATH_BASE_Y = 2000; // 起点和终点的 Y 坐标 (下落的位置)
const PATH_PEAK_Y = -1700;  // 中间顶点的 Y 坐标 (拱起的位置)

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
  const { trackShow } = useZA();
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      // phase2埋点8
      trackShow({
        moduleId: 'annual_report_moments_2025',
        type: 'Block',
        page: { page_id: '60850' }
      });
    }
  }, [inView, trackShow]);


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
  const contentAsset = assets.realMoment.content;

  const rows = Array.from({ length: ROWS_COUNT }, (_, i) => {
    const start = i * ITEMS_PER_ROW;
    const end = start + ITEMS_PER_ROW;
    if (end > contentAsset.length) {
      return contentAsset.slice(start).concat(contentAsset.slice(0, end - contentAsset.length));
    }
    return contentAsset.slice(start, end);
  });

  spansRef.current = [];

  return (
    <div ref={containerRef} className="relative w-full max-w-[500px] mx-auto h-[500px] overflow-hidden bg-white touch-none"
      onPointerDown={handlePointerDown}>
      <div ref={inViewRef} className="absolute inset-0 z-0">
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="object-cover"
          priority
        />
      </div>
      <div className={`relative w-full h-full ${isMobile ? '-mt-[10px]' : 'mt-[30px]'}`}>
        {rows.map((rowItems, rowIndex) => {
          const gap = isMobile ? 58 : 80;
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