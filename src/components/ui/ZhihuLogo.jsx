"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZhihuLogo = ({ className = '' }) => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const logoAsset = assets.kv.logo;
  // Display at 50% of original size for responsive design
  const displayWidth = logoAsset.width * 0.5;
  const displayHeight = logoAsset.height * 0.5;
  
  return (
    <div className={`relative z-50 ${className}`}>
      <Image 
        src={logoAsset.url}
        alt={logoAsset.alt}
        width={logoAsset.width}
        height={logoAsset.height}
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
        className="object-contain"
      />
    </div>
  );
};

export default ZhihuLogo;

