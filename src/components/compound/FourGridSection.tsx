"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context'; // 假设你有这个 context
import { useMobile } from '@/hooks/useMobile';

// 模拟接口返回的状态数据
// 实际开发中，这里的数据应该通过 useEffect 从 API 获取
const MOCK_TASK_STATUS = {
  video: true,      // true = 任务完成 (显示 Clear 图)
  report: false,    // false = 任务未完成 (显示 Blur 图)
  questions: true,
  cando: false,
};

const FourGridSection = () => {
  const { assets } = useAssets();
  const isMobile = useMobile();

  if (!assets) return null;

  const fourGridAssets = assets.fourGrid as any;
  const items = fourGridAssets.items || [];
  const bgImage = fourGridAssets.bg as any;


  return (
    <div className="relative w-full flex items-center pt-5">
      <div className="relative w-full">
        <div className="z-0 w-full">
          <Image
            src={bgImage.url}
            alt={bgImage.alt}
            width={bgImage.width}
            height={bgImage.height}
            className="w-full h-auto object-fill"
            priority
          />
        </div>

        <div
          className={`absolute z-10 flex top-[42%] left-[11.5%] ${isMobile ? 'gap-[3px]' : 'gap-[9px]'}`}>
          {items.map((item: any, index: number) => {
            const isCompleted = index % 2 === 0 ? true : false;
            const displayImg = isCompleted ? item.clear : item.blur;

            return (
              <div
                key={item.id}
                className="flex"
              >
                <div className="relative w-[70px] h-[98px]">
                  <Image
                    src={displayImg.url}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default FourGridSection;