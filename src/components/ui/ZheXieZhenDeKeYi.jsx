import React from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const ZheXieZhenDeKeYi = ({ className = '' }) => {
  const imageAsset = asset(assets.newImages.zheXieZhenDeKeYi);
  // Display at 25% of original size for responsive design
  const displayWidth = imageAsset.width * 0.25;
  const displayHeight = imageAsset.height * 0.25;

  return (
    <div className={`relative z-50 ${className} ml-[76px]`}>
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

export default ZheXieZhenDeKeYi;

