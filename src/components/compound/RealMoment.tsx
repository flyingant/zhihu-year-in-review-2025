"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
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
const BASE_DURATION = 40;
const CHAR_DELAY_STEP = 0.4;
const GAP_FACTOR = 1.1;

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

export default function CurveMarquee() {
  const { assets } = useAssets();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathString, setPathString] = useState(() => generateCurvedPath(430));

  const rowOffsets = useRef<number[] | null>(null);
  if (rowOffsets.current === null) {
    rowOffsets.current = Array.from({ length: ROWS_COUNT }, () => -100 - (Math.random() * 100));
  }

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

  return (
    <div ref={containerRef} className="relative w-full max-w-[500px] mx-auto h-[500px] overflow-hidden bg-white">
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
      <div className="relative w-full h-full pt-[60px]">
        {rows.map((rowItems, rowIndex) => {
          const rowTop = rowIndex * 58;
          const spacingStr = "　　　　　";
          const rowFullText = rowItems.join(spacingStr) + spacingStr;
          const totalChars = rowFullText.length;

          let dynamicDuration = Math.max(BASE_DURATION, totalChars * CHAR_DELAY_STEP * GAP_FACTOR);

          if (rowIndex % 2 !== 0) {
            dynamicDuration *= 1.1;
          }

          // 使用预先计算的随机起始位置偏移 (负数)，让每一行开始的位置不一样
          const baseOffset = rowOffsets.current![rowIndex];

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
                const delay = baseOffset - (charIndex * CHAR_DELAY_STEP);


                return (
                  <span
                    key={charIndex}
                    className="absolute left-0 top-0 text-base text-[#333] font-medium animate-float-path curve-text-item"
                    style={{
                      offsetPath: pathString,
                      animationDuration: `${dynamicDuration}s`,
                      animationDelay: `${delay}s`,
                      opacity: 0.9,
                      whiteSpace: "pre",
                      fontVariantNumeric: "tabular-nums",
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