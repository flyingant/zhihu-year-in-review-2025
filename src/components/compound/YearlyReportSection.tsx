"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { useZA } from '@/hooks/useZA';

const YearlyReportSection = () => {
  const { assets } = useAssets();
  const { trackShow, trackEvent } = useZA();

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    triggerOnce: true,
    threshold: 0.5
  });
  const [showClearImage, setShowClearImage] = useState(false);

  useEffect(() => {
    if (inView) {
      // phase2埋点4
      trackShow({
        moduleId: 'annual_report_2025',
        type: 'Block',
        page: { page_id: '60850', page_level: 1 }
      });
    }
  }, [inView, trackShow]);

  if (!assets) return null;

  const handleReportClick = () => {
    setShowClearImage(true);
    // phase2埋点5
    trackEvent('OpenUrl', {
      moduleId: 'annual_report_2025',
      type: 'Block',
      page: { page_id: '60850', page_level: 1 }
    });
  };

  const handleDiscussClick = () => {
    // phase2埋点6
    trackEvent('', {
      moduleId: 'annual_report_discussion_2025',
      type: 'Button',
      page: { page_id: '60850', page_level: 1 }
    });
  };

  const reportBg = assets.yearly.reportBg;
  const liukanshanWaving = assets.yearly.liukanshanWaving;
  const blurryImage = assets.yearly.reportBlurImage;
  const clearImage = assets.yearly.reportClearImage;

  return (
    <div className="relative w-full flex flex-col items-center px-[16px]">
      <div
        ref={setRefs}
        className="relative w-full flex flex-col items-center"
      >
        <div className="relative w-full flex items-center justify-center" onClick={handleReportClick}>
          <Image
            src={reportBg.url}
            alt={reportBg.alt}
            width={reportBg.width / 2}
            height={reportBg.height / 2}
            className="relative z-50 w-full h-auto object-contain"
            priority
          />
          {/* Video element with slide-up/slide-down animation */}
          <div
            className={`absolute top-[62px] left-[3px] w-[72px] h-[72px] z-10 flex items-center justify-center transition-transform duration-500  ${showIcon ? 'opacity-100 translate-y-0' : 'translate-y-[150%]'
              }`}
          >
            <video
              className="w-full h-full object-contain rounded-lg"
              loop
              muted
              autoPlay
              playsInline
              preload="auto"
            >
              <source src={liukanshanWaving.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="absolute bottom-[5.5%] right-[8%] z-50 w-[20%] overflow-hidden rounded-[2px]">
          <div className={`relative w-full transition-opacity duration-500 ${showClearImage ? 'opacity-0' : 'opacity-100'}`}>
            <Image
              src={blurryImage?.url}
              alt={blurryImage.alt}
              width={blurryImage.width}
              height={blurryImage.height}
              className="object-cover"
            />
          </div>
          <div className={`absolute inset-0 w-full transition-opacity duration-500 ${showClearImage ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              src={clearImage?.url}
              alt={clearImage.alt}
              width={clearImage.width}
              height={clearImage.height}
              className="object-cover"
            />
          </div>
        </div>
        <div
          className="absolute bottom-[8%] left-[8%] w-[32%] h-[16%] z-30 cursor-pointer"
          onClick={handleDiscussClick}
        >
        </div>
      </div>
    </div>
  );
};

export default YearlyReportSection;

