"use client";

import React, { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useAssets } from '@/context/assets-context';
import { completeTask, getCampaignInfo } from '@/api/campaign';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useElementCenter } from '@/hooks/useElementCenter';

const RealCanDoSection = () => {
  const { assets } = useAssets();
  const { trackShow, trackEvent } = useZA();
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    threshold: 0.5
  });
  const [showClearImage, setShowClearImage] = useState(false);

  useEffect(() => {
    if (inView) {
      trackShow({ moduleId: 'vote_ranking_2025_new', type: 'Block', page: { page_id: '60850', page_level: 1 } });
    }
  }, [inView, trackShow]);

  const handleClick = useCallback(async (item: any) => {
    setShowClearImage(true);

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
        moduleId: 'vote_selection_2025_new', // 请根据文档更新 ID
        type: 'Button',
        page: { page_id: '60850', page_level: 1 }
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
  }, [assets, trackEvent, isZhihuApp, isHybridAvailable, openURL]);

  if (!assets) return null;

  const sectionAssets = assets.zheXieZhenDeKeYiImages2 || {};
  const imagesToDisplay = sectionAssets.items || [];
  const titleAsset = sectionAssets.title;
  const liukanshanWaving = assets.yearly.liukanshanWaving;
  const clearImageAsset = sectionAssets.zhenkeyiClearImage;
  const blurImageAsset = sectionAssets.zhenkeyiBlurImage;
  ;

  return (
    <div ref={setRefs} className="relative w-full flex flex-col">
      <div className="relative w-full mb-4">
        <div className={`relative z-50 mr-[119px]`}>
          <Image
            src={titleAsset.url}
            alt={titleAsset.alt}
            width={titleAsset.width}
            height={titleAsset.height}
            className="object-contain"
          />
        </div>
        <div
          className={`absolute -bottom-[70%] left-[2%] w-[72px] z-0 transition-transform duration-500 ease-out ${showIcon
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[100%]'
            }`}
        >
          <video
            className="w-full h-auto object-contain"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={liukanshanWaving.url} type="video/mp4" />
          </video>
        </div>

        <div className="absolute right-0 top-3 w-[100px] h-[80px] z-60">
          <div className="relative w-full h-full transition-all duration-500">
            <Image
              src={showClearImage ? clearImageAsset.url : blurImageAsset.url}
              alt="状态图片"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-4 px-4">
        {imagesToDisplay.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => handleClick(item)}
            className="block w-full cursor-pointer active:scale-95 transition-transform"
          >
            <div className="relative w-full flex justify-center">
              <Image
                src={item.image_url || item.url}
                alt={item.alt || `选项 ${index + 1}`}
                width={item.width || 514}
                height={item.height || 163}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealCanDoSection;