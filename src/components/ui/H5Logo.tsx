"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const H5Logo = ({ className = '' }) => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const logoAsset = assets.h5Logo.bg;
  const ratio = 1;
  return (
    <div className={`relative z-50 ${className} flex justify-center pb-10`}>
      <Image
        src={logoAsset.url}
        alt={logoAsset.alt}
        width={logoAsset.width / ratio}
        height={logoAsset.height / ratio}
        className="object-contain"
      />
    </div>
  );
};

export default H5Logo;
