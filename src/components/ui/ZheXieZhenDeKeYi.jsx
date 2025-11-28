"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZheXieZhenDeKeYi = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const imageAsset = assets.newImages.zheXieZhenDeKeYi;

  return (
    <div className={`relative z-50 ${className} mr-[30px]`}>
      <Image
        src={imageAsset.url}
        alt={imageAsset.alt}
        width={imageAsset.width}
        height={imageAsset.height}
        className="object-contain"
      />
    </div>
  );
};

export default ZheXieZhenDeKeYi;

