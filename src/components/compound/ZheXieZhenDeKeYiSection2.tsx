"use client";

import React, { useEffect, useCallback } from 'react';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import Image from 'next/image';
import { useZA } from '@/hooks/useZA';
import { useAssets } from '@/context/assets-context';
import { completeTask, getCampaignInfo } from '@/api/campaign';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useElementCenter } from '@/hooks/useElementCenter';
import { useUserData } from '@/context/user-data-context';

type RealCanItem = {
  jump_url?: string;
  image_url?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

const RealCanDoSection = () => {
  const { assets } = useAssets();
  const { userData, lightUpMomentAndRefresh } = useUserData();
  const { trackShow, trackEvent } = useZA();
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    threshold: 0.5
  });

  // Get really_can status from API
  const reallyCanStatus = userData?.momentLightList?.find(
    (item) => item.position === 'really_can'
  );

  // Get the image URL to display based on status
  const displayedImageUrl = reallyCanStatus
    ? (reallyCanStatus.light_status === 1
        ? reallyCanStatus.light_image_url
        : reallyCanStatus.un_light_image_url)
    : undefined;

  useEffect(() => {
    if (inView) {
      trackShow({ moduleId: 'vote_ranking_2025_new', type: 'Block', page: { page_id: '60850' } });
    }
  }, [inView, trackShow]);

  const handleClick = useCallback(async (item: RealCanItem) => {
    lightUpMomentAndRefresh('really_can');

    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.BROWSE_ZHEXIEZHENDEKEYI)
        .then(() => getCampaignInfo(assets.campaign.activityId))
        .catch((error) => {
          console.error('Task completion error:', error);
        });
    }

    if (item.jump_url) {
      // 埋点
      trackEvent('OpenUrl', {
        moduleId: 'vote_selection_2025_new',
        type: 'Button',
        page: { page_id: '60850' }
      });

      if (isZhihuApp && isHybridAvailable) {
        try {
          await openURL(item.jump_url);
        } catch {
          window.location.href = item.jump_url;
        }
      } else {
        window.location.href = item.jump_url;
      }
    }
  }, [assets, trackEvent, isZhihuApp, isHybridAvailable, openURL, lightUpMomentAndRefresh]);

  if (!assets) return null;

  const sectionAssets = assets.zheXieZhenDeKeYiImages2 || {};
  const imagesToDisplay = sectionAssets.items || [];
  const titleAsset = sectionAssets.title;
  const liukanshanLookup = assets.yearly.liukanshanLookup;

  return (
    <div ref={setRefs} className="relative w-full flex flex-col">
      <div className="relative w-full mb-4">
       {/* Title */}
      <div className="mb-4">
        <ZheXieZhenDeKeYi />
      </div>
        <div
          className={`absolute -bottom-[70%] left-[2%] w-[72px] z-0 transition-transform duration-500 ease-out ${showIcon
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
            }`}
        >
          <video
            className="w-full h-auto object-contain"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={liukanshanLookup.url} type="video/mp4" />
          </video>
        </div>

        <div className="absolute right-0 top-3 w-[100px] h-[80px] z-60">
          <div className="relative w-full h-full">
            {displayedImageUrl && (
              <Image
                key={displayedImageUrl}
                src={displayedImageUrl}
                alt="状态图片"
                fill
                className="object-contain transition-opacity duration-500 ease-in-out"
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 px-4">
        {imagesToDisplay.map((item: RealCanItem, index: number) => {
          const imageUrl = item.image_url || item.url;
          return (
            <div
              key={index}
              onClick={() => handleClick(item)}
              className="block w-full cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative w-full flex justify-center">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.alt || `选项 ${index + 1}`}
                    width={item.width || 514}
                    height={item.height || 163}
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealCanDoSection;