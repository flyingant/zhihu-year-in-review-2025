"use client";

import React, { useMemo } from "react";

interface TimeData {
  earlyMorning: number;
  morning: number;
  forenoon: number;
  noon: number;
  afternoon: number;
  evening: number;
  night: number;
}

const SEGMENT_CONFIG = [
  { key: 'earlyMorning', label: '0-5 点', color: '#FF9FA9' },
  { key: 'morning', label: '5-8 点', color: '#FCD8FF' },
  { key: 'forenoon', label: '8-11 点', color: '#C0E7FF' },
  { key: 'noon', label: '11-13 点', color: '#AEF6E5' },
  { key: 'afternoon', label: '13-17 点', color: '#B4F1B3' },
  { key: 'evening', label: '17-19 点', color: '#FFEFA0' },
  { key: 'night', label: '19-24 点', color: '#FDBA74' },
];

function getCoordinatesForPercent(percent: number, radius: number) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x * radius, y * radius];
}

export default function TimeDonutChart({ data }: { data: TimeData }) {
  const size = 280;
  const center = size / 2;

  // 图表半径配置
  const baseRadius = 130;
  const baseInnerRadius = 105;
  const popRadius = 140;     // 最大块凸出半径
  const popInnerRadius = 90; // 最大块内凹半径

  // 文字距离配置
  const baseLabelRadius = 160; // 普通文字距离
  const popLabelRadius = 170;  // 最大块文字距离 (稍微移开一点)

  const maxValue = Math.max(...Object.values(data));
  const total = Object.values(data).reduce((acc, cur) => acc + cur, 0);

  const getPercentageString = (val: number) => {
    if (total === 0) return '0%';
    return `${Math.round((val / total) * 100)}%`;
  };

  const slices = useMemo(() => {
    const safeTotal = total === 0 ? 1 : total;
    let accumulatedPercent = 0;
    const startOffset = -0.25;

    return SEGMENT_CONFIG.map((config) => {
      const value = data[config.key as keyof TimeData];
      const percent = value / safeTotal;
      const isMax = value === maxValue && value > 0;

      // 1. 动态计算图形半径
      const currentOuterRadius = isMax ? popRadius : baseRadius;
      const currentInnerRadius = isMax ? popInnerRadius : baseInnerRadius;

      // 2. 动态计算文字半径：如果是最大块，文字往外挪一点
      const currentLabelRadius = isMax ? popLabelRadius : baseLabelRadius;

      const startPercent = accumulatedPercent + startOffset;
      const endPercent = accumulatedPercent + percent + startOffset;

      // 计算扇形中心角度，用于定位文字
      const midPercent = startPercent + (percent / 2);

      // 计算文字坐标
      const [lx, ly] = getCoordinatesForPercent(midPercent, currentLabelRadius);
      const labelX = center + lx;
      const labelY = center + ly;

      accumulatedPercent += percent;

      const [startX, startY] = getCoordinatesForPercent(startPercent, currentOuterRadius);
      const [endX, endY] = getCoordinatesForPercent(endPercent, currentOuterRadius);
      const [innerStartX, innerStartY] = getCoordinatesForPercent(startPercent, currentInnerRadius);
      const [innerEndX, innerEndY] = getCoordinatesForPercent(endPercent, currentInnerRadius);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = [
        // 1. 移动到起点的内圆位置 (M = Move to)
        `M ${center + innerStartX} ${center + innerStartY}`,
        // 2. 画一条直线到起点的外圆位置 (L = Line to)
        `L ${center + startX} ${center + startY}`,
        // 3. 画外圆弧到终点的外圆位置 (A = Arc)
        // A指令参数：半径x 半径y 旋转角度 大弧标志 顺时针标志 终点x 终点y
        `A ${currentOuterRadius} ${currentOuterRadius} 0 ${largeArcFlag} 1 ${center + endX} ${center + endY}`,
        // 4. 画一条直线回到终点的内圆位置
        `L ${center + innerEndX} ${center + innerEndY}`,
        // 5. 画内圆弧回到起点的内圆位置 (注意这里是逆时针画，最后那个参数是 0)
        `A ${currentInnerRadius} ${currentInnerRadius} 0 ${largeArcFlag} 0 ${center + innerStartX} ${center + innerStartY}`,
        // 6. 闭合路径 (Z)
        'Z'
      ].join(' ');

      return {
        ...config,
        path: pathData,
        value,
        percent,
        isMax,
        labelX,
        labelY,
        percentStr: getPercentageString(value)
      };
    });
  }, [data, center, maxValue, total]);

  return (
    <div className="relative" style={{ width: size, height: size }}>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {slices.map((slice) => {
          if (slice.value <= 0) return null;
          return (
            <g key={slice.key}>
              <path
                d={slice.path}
                fill={slice.color}
                stroke="black"
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{
                  filter: slice.isMax ? 'drop-shadow(4px 4px 0px rgba(0,0,0,0.15))' : 'none',
                  zIndex: slice.isMax ? 10 : 1,
                  position: 'relative'
                }}
              />
            </g>
          );
        })}
      </svg>

      {slices.map((slice) => {
        // 如果值 <= 0 或者 百分比 < 2%，则不显示文字
        if (slice.value <= 0 || slice.percent < 0.02) return null;

        const percentStyle: React.CSSProperties = slice.isMax
          ? { fontSize: '20px', fontWeight: 700 }
          : { fontSize: '12px' };

        return (
          <div
            key={slice.key}
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{
              left: slice.labelX,
              top: slice.labelY,
              transform: 'translate(-50%, -50%)',
              width: '80px',
              zIndex: 20
            }}
          >
            <div className="leading-tight mb-[2px]" style={{ fontSize: '12px' }}>
              {slice.label}
            </div>
            <div style={percentStyle}>
              {slice.percentStr}
            </div>
          </div>
        );
      })}
    </div>
  );
}