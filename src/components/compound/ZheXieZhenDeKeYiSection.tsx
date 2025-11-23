"use client";

import React from 'react';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const ZheXieZhenDeKeYiSection = () => {
  const zheXieZhenDeKeYiBanner = asset(assets.newImages.zheXieZhenDeKeYiBanner) as { url: string; alt: string, width: number, height: number };
  return (
    <div className="relative w-full flex flex-col items-center pb-7">
      {/* Title */}
      <div className="mb-4">
        <ZheXieZhenDeKeYi />
      </div>

      {/* Content - Placeholder SVG */}
      <div className="w-[339px] h-[126px] flex items-center justify-center">
        <div className="relative w-full flex justify-center">
          <Image
            src={zheXieZhenDeKeYiBanner.url}
            alt={zheXieZhenDeKeYiBanner.alt}
            width={zheXieZhenDeKeYiBanner.width}
            height={zheXieZhenDeKeYiBanner.height}
            className="h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ZheXieZhenDeKeYiSection;

