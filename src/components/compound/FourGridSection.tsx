"use client";

import React from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useMobile } from '@/hooks/useMobile';
import { useUserData } from '@/context/user-data-context';
import { MomentPosition } from '@/api/campaign';

// 映射 API position 到 asset item id
const POSITION_TO_ID_MAP: Record<MomentPosition, string> = {
  'annual_video': 'video',
  'annual_report': 'report',
  'annual_question': 'questions',
  'really_can': 'cando',
};

const FourGridSection = () => {
  const { assets } = useAssets();
  const { userData } = useUserData();
  const isMobile = useMobile();

  if (!assets) return null;

  // 创建从 position 到 light status 的映射
  const lightStatusMap = new Map<string, { light_status: 0 | 1; light_image_url: string; un_light_image_url: string }>();

  if (userData?.momentLightList) {
    userData.momentLightList.forEach((item) => {
      const assetId = POSITION_TO_ID_MAP[item.position];
      if (!assetId) return;
      lightStatusMap.set(assetId, {
        light_status: item.light_status,
        light_image_url: item.light_image_url,
        un_light_image_url: item.un_light_image_url,
      });
    });
  }

  const fourGridAssets = assets.fourGrid;
  const items = fourGridAssets.items || [];
  const bgImage = fourGridAssets.bg;

  return (
    <div className="relative w-full flex items-center pt-5">
      <div className="relative w-full">
        <div className="z-0 w-full">
          <Image
            src={bgImage.url}
            alt={bgImage.alt}
            width={bgImage.width}
            height={bgImage.height}
            className="w-full h-auto object-fill"
            priority
          />
        </div>

        <div
          className={`absolute z-10 flex top-[42%] left-[11.5%] ${isMobile ? 'gap-[3px]' : 'gap-[9px]'}`}>
          {items.map((item) => {
            const lightStatus = lightStatusMap.get(item.id);
            const isCompleted = lightStatus?.light_status === 1;
            const imageUrl = isCompleted
              ? lightStatus?.light_image_url
              : lightStatus?.un_light_image_url;

            if (!lightStatus || !imageUrl) {
              return (
                <div key={item.id} className="flex">
                  <div className="relative w-[70px] h-[98px]" />
                </div>
              );
            }

            const imageAlt = isCompleted ? `${item.name}-亮` : `${item.name}-暗`;

            return (
              <div key={item.id} className="flex">
                <div className="relative w-[70px] h-[98px]">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FourGridSection;