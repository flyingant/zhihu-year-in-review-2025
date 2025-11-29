"use client";
import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const LiuKanShanBianLiDian = ({ className = '' }) => {
  const { assets } = useAssets();

  if (!assets) return null;

  const imageAsset = assets.newImages.liukanshanBianLiDian;
  return (
    <div className={`relative z-50 ${className} px-[54px]`}>
      <Image
        src={imageAsset.url}
        alt={imageAsset.alt}
        width={imageAsset.width * 0.5}
        height={imageAsset.height * 0.5}
        className="object-contain"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default LiuKanShanBianLiDian;

