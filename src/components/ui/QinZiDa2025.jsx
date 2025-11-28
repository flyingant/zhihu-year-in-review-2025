"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const QinZiDa2025 = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const imageAsset = assets.newImages.wuzida2025;

  return (
    <div className={`relative z-50 ${className} ml-[50px]`}>
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

export default QinZiDa2025;

