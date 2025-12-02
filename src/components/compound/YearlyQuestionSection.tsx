"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { useZA } from '@/hooks/useZA';

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
  const { ref: setRefs, isCenter: showIcon } = useElementCenter({ threshold: 0.5 });

  const { trackShow, trackEvent } = useZA();

  const [showClearImage, setShowClearImage] = useState(false);

  if (!assets) return null;

  const bgAsset = assets.yearly?.questionBg;
  const blurAsset = assets.yearly?.questionBlurImage;
  const clearAsset = assets.yearly?.questionClearImage;
  const liukanshanAsset = assets.yearly.liukanshanWaving;
  const urlAsset = assets.urls.yearlyQuestions;

  const handleQuestionClick = (url: string, index: number) => {
    setShowClearImage(true);

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
            className={`absolute top-[5.3%] right-[1%] w-[72px] z-0 transition-transform duration-700 ease-out ${showIcon ? 'translate-y-0 opacity-100' : 'translate-y-[100%]'
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

          <div className="absolute bottom-[2.5%] left-[11.5%] w-[112px] h-[44px] z-50">
            {/* 模糊图 */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${showClearImage ? 'opacity-0' : 'opacity-100'}`}>
              {blurAsset && (
                <Image src={blurAsset.url} fill className="object-contain" alt="blur" />
              )}
            </div>

            {/* 清晰图 */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${showClearImage ? 'opacity-100' : 'opacity-0'}`}>
              {clearAsset && (
                <Image src={clearAsset.url} fill className="object-contain" alt="clear" />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TenQuestionsSection;