import React from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const HomeBottomBg = ({ className = '' }) => {
  const bgBottomAsset = asset(assets.home.bgBottom) as { url: string; alt: string, height: number, width: number };

  return (
    <div className={`relative z-50 ${className}`}>
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

