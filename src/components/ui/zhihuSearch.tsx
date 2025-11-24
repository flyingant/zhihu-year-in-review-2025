import React from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const ZhihuSearch = ({ className = '' }) => {
  const searchAsset = asset(assets.zhihuSearch.bg) as { url: string; alt: string, height: number, width: number };
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

