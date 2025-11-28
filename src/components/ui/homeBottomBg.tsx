"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const HomeBottomBg = ({ className = '' }) => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const bgBottomAsset = assets.home.bgBottom;

  return (
    <div className={`relative z-49 ${className}`}>
      <Image
        src={bgBottomAsset.url}
        alt={bgBottomAsset.alt}
        width={bgBottomAsset.width}
        height={bgBottomAsset.height}
        className="object-contain"
      />
    </div>
  );
};

export default HomeBottomBg;

