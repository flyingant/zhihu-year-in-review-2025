"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZheXieZhenDeKeYi2 = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const imageAsset = assets.newImages.zheXieZhenDeKeYi2;

  return (
    <div className={`relative z-1 ${className}`}>
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

export default ZheXieZhenDeKeYi2;