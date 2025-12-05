"use client";

import React, { useEffect, useCallback } from 'react';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import Image from 'next/image';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useAssets } from '@/context/assets-context';
import { completeTask, getCampaignInfo } from '@/api/campaign';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';

const ZheXieZhenDeKeYiSection = () => {
  const { assets } = useAssets();
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();

  useEffect(() => {
    if (moduleInView) {
      // 埋点13
      trackShow({ moduleId: 'vote_ranking_2025', type: 'Block', page: { page_id: '60850', page_level: 1 } });
    }
  }, [moduleInView, trackShow]);

  const handleClick = useCallback(async (item: { jump_url: string; image_url: string; width: number; height: number; alt: string }) => {
    // Call completeTask API and reload campaign data
    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.BROWSE_ZHEXIEZHENDEKEYI)
        .then(() => {
          // Reload campaign data after successfully completing the task
          return getCampaignInfo(assets.campaign.activityId);
        })
        .catch((error) => {
          console.error('Error completing task BROWSE_ZHEXIEZHENDEKEYI or reloading campaign data:', error);
          // Silently fail - this is just tracking, don't block user flow
        });
    }
    if (item.jump_url) {
      //埋点14
      trackEvent('OpenUrl', {
        moduleId: 'vote_selection_2025',
        type: 'Button',
        page: { page_id: '60850', page_level: 1 }
      });

      // Use zhihuHybrid if in zhihu app, otherwise use window.location.href
      if (isZhihuApp && isHybridAvailable) {
        try {
          await openURL(item.jump_url);
        } catch (error) {
          console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
          window.location.href = item.jump_url;
        }
      } else {
        window.location.href = item.jump_url;
      }
    }
  }, [assets, trackEvent, isZhihuApp, isHybridAvailable, openURL]);

  if (!assets) return null;

  // Use example images from assets.json
  const imagesToDisplay = assets.zheXieZhenDeKeYiImages.map((item) => ({
    image_url: item.url,
    jump_url: item.jump_url || '',
    width: item.width,
    height: item.height,
    alt: item.alt
  }));

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col">
      {/* Title */}
      <div className="mb-4">
        <ZheXieZhenDeKeYi />
      </div>

      {/* Content - Column layout image list */}
      <div className="w-full flex flex-col items-center gap-4 px-4">
        {imagesToDisplay.map((item, index) => {
          const content = (
            <div key={index} className="relative w-full flex justify-center">
              <Image
                src={item.image_url}
                alt={item.alt || `真实链接 ${index + 1}`}
                width={item.width || 514}
                height={item.height || 163}
                className="w-full h-auto object-contain"
              />
            </div>
          );

          return (
            <div
              key={index}
              onClick={() => handleClick(item)}
              className="block w-full cursor-pointer"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ZheXieZhenDeKeYiSection;

