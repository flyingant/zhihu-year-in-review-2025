"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const ZhihuSearch = ({ className = '' }) => {
  const { assets } = useAssets();
  
  if (!assets) return null;
  
  const searchAsset = assets.zhihuSearch.bg;
  const ratio = 3;
  return (
    <div className={`relative z-50 ${className} flex justify-center`}>
      <Image
        src={searchAsset.url}
        alt={searchAsset.alt}
        width={searchAsset.width / ratio}
        height={searchAsset.height / ratio}
        className="object-contain"
      />
    </div>
  );
};

export default ZhihuSearch;

