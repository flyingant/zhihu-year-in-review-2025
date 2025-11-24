"use client";

import React from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const SidebarCampaignRules = () => {
  const imageAsset = asset(assets.newImages.sidebarCampaignRules) as { url: string; alt: string; width: number; height: number };
  const displayWidth = imageAsset.width / 2;
  const displayHeight = imageAsset.height / 2;

  return (
    <div className="absolute right-0 top-[44%] z-50 pointer-events-auto">
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

export default SidebarCampaignRules;

