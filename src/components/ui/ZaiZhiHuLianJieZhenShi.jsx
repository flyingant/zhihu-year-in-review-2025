"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZaiZhiHuLianJieZhenShi = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const imageAsset = assets.newImages.zaiZhiHuLianJieZhenShi;
  // Display at 25% of original size for responsive design

  return (
    <div className={`relative z-50 ${className} mr-[112px]`}>
      <Image
        src={imageAsset.url}
        alt={imageAsset.alt}
        width={imageAsset.width / 2}
        height={imageAsset.height / 2}
        className="object-contain"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default ZaiZhiHuLianJieZhenShi;

