"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { useZA } from '@/hooks/useZA';
import { useUserData } from '@/context/user-data-context';

const MASK_POSITIONS = [
  { top: '16.5%', left: '6%', width: '43%', height: '12%' },  // 左1
  { top: '18%', left: '53%', width: '43%', height: '12%' }, // 右1
  { top: '30.5%', left: '8.5%', width: '43%', height: '12%' },  // 左2
  { top: '34.5%', left: '56%', width: '43%', height: '12%' }, // 右2
  { top: '47%', left: '6%', width: '43%', height: '12%' },  // 左3
  { top: '48.5%', left: '51%', width: '43%', height: '12%' }, // 右3
  { top: '63.5%', left: '7%', width: '43%', height: '12%' },  // 左4
  { top: '65%', left: '53.5%', width: '43%', height: '12%' }, // 右4
  { top: '78%', left: '8.5%', width: '43%', height: '12%' },  // 左5
  { top: '81.5%', left: '56%', width: '43%', height: '12%' }, // 右5
];

const TenQuestionsSection = () => {
  const { assets } = useAssets();
  const { userData, lightUpMomentAndRefresh } = useUserData();
  const { ref: setRefs, isCenter: showIcon } = useElementCenter({ threshold: 0.5 });

  const { trackShow, trackEvent } = useZA();

  // Removed local showClearImage usage now that images rely solely on API data

  if (!assets) return null;

  const bgAsset = assets.yearly?.questionBg;
  const liukanshanAsset = assets.yearly.liukanshanWaving;
  const urlAsset = assets.urls.yearlyQuestions;

  // Get annual_question status from API
  const annualQuestionStatus = userData?.momentLightList?.find(
    (item) => item.position === 'annual_question'
  );

  // Get the image URL to display based on status
  const displayedImageUrl = annualQuestionStatus
    ? (annualQuestionStatus.light_status === 1
      ? annualQuestionStatus.light_image_url
      : annualQuestionStatus.un_light_image_url)
    : undefined;

  const handleQuestionClick = (url: string, index: number) => {
    lightUpMomentAndRefresh('annual_question');

    // trackEvent('OpenUrl', {
    //   moduleId: 'ten_questions_2025',
    //   type: 'Block',
    //   moduleIndex: index
    // });

    window.location.assign(url);
  };


  return (
    <div ref={setRefs} className="relative w-full flex flex-col items-center pr-[16px] pl-[8px] py-10">
      <div className="relative w-full">
        <div className="relative w-full h-auto">
          {bgAsset && (
            <Image
              src={bgAsset.url}
              alt={bgAsset.alt}
              width={bgAsset.width}
              height={bgAsset.height}
              className="w-full h-auto object-contain relative z-50"
              priority
            />
          )}
          <div
            className={`absolute top-[5.3%] right-[1%] w-[72px] z-0 transition-transform duration-700 ease-out ${showIcon ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
          >
            <video
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={liukanshanAsset.url} type="video/mp4" />
            </video>
          </div>
          {MASK_POSITIONS.map((pos, index) => (
            <div
              key={index}
              onClick={() => handleQuestionClick(urlAsset[index], index)}
              className="absolute z-50 cursor-pointer active:opacity-50"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                // background: 'rgba(255, 0, 0, 0.3)', // 调试用：打开这个可以看到红色热区，方便对齐
              }}
            />
          ))}

          <div className="absolute bottom-[-1%] left-[16%] w-[95px] h-[75px] z-50">
            {displayedImageUrl && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  key={displayedImageUrl}
                  src={displayedImageUrl}
                  fill
                  className="object-contain transition-opacity duration-500 ease-in-out"
                  alt={annualQuestionStatus?.light_status === 1 ? "annual question clear" : "annual question blur"}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TenQuestionsSection;