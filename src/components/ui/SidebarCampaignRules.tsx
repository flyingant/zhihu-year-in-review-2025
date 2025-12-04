"use client";

import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';

const SidebarCampaignRules = () => {
  const { assets } = useAssets();
  const { trackEvent } = useZA();
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();

  if (!assets) return null;

  const imageAsset = assets.newImages.sidebarCampaignRules;
  const displayWidth = imageAsset.width / 2;
  const displayHeight = imageAsset.height / 2;

  const handleClick = async () => {
    //埋点26
    trackEvent('', {
      moduleId: 'liukanshan_gift_rules_2025',
      type: 'Button',
      page: { page_id: '60850', page_level: 1 }
    });
    const url = assets?.urls?.sidebarCampaignRules;
    if (url) {
      // Use zhihuHybrid if in zhihu app, otherwise use window.location.href
      if (isZhihuApp && isHybridAvailable) {
        try {
          await openURL(url);
        } catch (error) {
          console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    }
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

