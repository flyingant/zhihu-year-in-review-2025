"use client";

import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const QiangXianYuGaoSection = () => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const qiangXianYuGaoBanner = assets.newImages.qiangXianYuGaoBanner;

  return (
    <div className="relative w-full flex flex-col items-center pb-6">
      <div className="w-full max-w-[339px] flex items-center justify-center">
        <div className="relative w-full flex justify-center">
          <Image
            src={qiangXianYuGaoBanner.url}
            alt={qiangXianYuGaoBanner.alt}
            width={qiangXianYuGaoBanner.width}
            height={qiangXianYuGaoBanner.height}
            className="w-full h-auto object-contain"
            style={{ maxWidth: '339px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default QiangXianYuGaoSection;

