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
// 自动动画速度 (每秒移动的百分比)
const AUTO_ANIMATION_SPEED = 0.01; // 调整这个值来控制动画速度

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
  const lastTimeRef = useRef<number | null>(null);
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

  // 生成随机偏移量，只生成一次
  const [rowOffsets] = useState(() => 
    Array.from({ length: ROWS_COUNT }, () => Math.random() * 100)
  );

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

  // 自动动画效果
  useEffect(() => {
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      // 如果页面隐藏，暂停动画
      if (document.hidden) {
        lastTimeRef.current = null;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // 根据时间差更新进度 (deltaTime 是毫秒，转换为秒)
      const deltaProgress = (deltaTime / 1000) * AUTO_ANIMATION_SPEED * 100;
      progressRef.current += deltaProgress;

      // 保持进度在合理范围内，防止数值过大
      progressRef.current = wrapPercent(progressRef.current);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
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

  return (
    <div ref={containerRef} className="relative w-full max-w-[500px] mx-auto h-[500px] overflow-hidden bg-white">
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
      <div className={`relative w-full h-full ${isMobile ? '-mt-[20px]' : 'mt-[60px]'}`}>
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
                      // 在第一个元素的 ref 回调中重置数组
                      if (rowIndex === 0 && charIndex === 0) {
                        spansRef.current = [];
                      }
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