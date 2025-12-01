"use client";

import React, { useEffect } from 'react';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import Image from 'next/image';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useAssets } from '@/context/assets-context';

const ZheXieZhenDeKeYiSection = () => {
  const { assets } = useAssets();
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (moduleInView) {
      // 埋点13
      trackShow({ moduleId: 'vote_ranking_2025', type: 'Block' });
    }
  }, [moduleInView, trackShow]);

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
          const handleClick = () => {
            // todo 有链接后需要把埋点放到if里面，现在这样放是为了测试
            //埋点14
            trackEvent('OpenUrl', {
              moduleId: 'vote_selection_2025',
              type: 'Button'
            });
            if (item.jump_url) {
              window.location.href = item.jump_url;
            }
          };

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
              onClick={handleClick}
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

