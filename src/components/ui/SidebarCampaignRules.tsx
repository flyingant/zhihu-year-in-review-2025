"use client";

import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';

const SidebarCampaignRules = () => {
  const { assets } = useAssets();
  const { trackEvent } = useZA();

  if (!assets) return null;

  const imageAsset = assets.newImages.sidebarCampaignRules;
  const displayWidth = imageAsset.width / 2;
  const displayHeight = imageAsset.height / 2;

  const handleClick = () => {
    //埋点26
    trackEvent('', {
      moduleId: 'liukanshan_gift_rules_2025',
      type: 'Button'
    });
    window.location.href = 'https://www.zhihu.com/parker/campaign/1976720513247250310';
  };

  return (
    <div id="sidebar-campaign-rules" className="absolute right-0 top-[44%] z-50 pointer-events-auto">
      <div
        onClick={handleClick}
        className="block cursor-pointer"
      >
        <Image
          src={imageAsset.url}
          alt={imageAsset.alt}
          width={imageAsset.width}
          height={imageAsset.height}
          style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default SidebarCampaignRules;

