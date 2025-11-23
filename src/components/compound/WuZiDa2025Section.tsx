"use client";

import React from 'react';
import WuZiDa2025 from '@/components/ui/WuZiDa2025';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const WuZiDa2025Section = () => {
  const wuzida2025Banner = asset(assets.newImages.wuzida2025Banner) as { url: string; alt: string, width: number, height: number };

  return (
    <div className="relative w-full flex flex-col items-center pb-12">
      {/* Title */}
      <div className="mb-4">
        <WuZiDa2025 />
      </div>

      <div className="w-[339px] h-[126px] flex items-center justify-center">
        <div className="relative w-full flex justify-center">
          <Image
            src={wuzida2025Banner.url}
            alt={wuzida2025Banner.alt}
            width={wuzida2025Banner.width}
            height={wuzida2025Banner.height}
            className="h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default WuZiDa2025Section;

