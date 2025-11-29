"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZhihuLogo = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const logoAsset = assets.kv.logo;

  return (
    <div className={`relative z-50 ${className} px-[140px]`}>
      <Image
        src={logoAsset.url}
        alt={logoAsset.alt}
        width={logoAsset.width / 2}
        height={logoAsset.height / 2}
        style={{ width: '100%' }}
        className="object-contain"
      />
    </div>
  );
};

export default ZhihuLogo;

