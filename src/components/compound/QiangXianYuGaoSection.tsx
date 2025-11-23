"use client";

import React from 'react';
import QiangXianYuGao from '@/components/ui/QiangXianYuGao';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const QiangXianYuGaoSection = () => {
  const qiangXianYuGaoBanner = asset(assets.newImages.qiangXianYuGaoBanner) as { url: string; alt: string, width: number, height: number };

  return (
    <div className="relative w-full flex flex-col items-center pb-6">
      {/* Title */}
      <div className="mb-4">
        <QiangXianYuGao />
      </div>

      <div className="w-[339px] h-[126px] flex items-center justify-center">
        <div className="relative w-full flex justify-center">
          <Image
            src={qiangXianYuGaoBanner.url}
            alt={qiangXianYuGaoBanner.alt}
            width={qiangXianYuGaoBanner.width}
            height={qiangXianYuGaoBanner.height}
            className="h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default QiangXianYuGaoSection;

