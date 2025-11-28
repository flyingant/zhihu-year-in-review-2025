"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const LiuKanShanBianLiDian = ({ className = '' }) => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const imageAsset = assets.newImages.liukanshanBianLiDian;
  // Display at 25% of original size for responsive design
  const displayWidth = imageAsset.width * 0.33;
  const displayHeight = imageAsset.height * 0.33;

  return (
    <div className={`relative z-50 ${className}`}>
      <Image
        src={imageAsset.url}
        alt={imageAsset.alt}
        width={imageAsset.width}
        height={imageAsset.height}
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
        className="object-contain"
      />
    </div>
  );
};

export default LiuKanShanBianLiDian;

