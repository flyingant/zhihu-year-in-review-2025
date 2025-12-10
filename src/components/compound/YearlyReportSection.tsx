"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { useZA } from '@/hooks/useZA';
import { useUserData } from '@/context/user-data-context';

const YearlyReportSection = () => {
  const { assets } = useAssets();
  const { userData, lightUpMomentAndRefresh } = useUserData();
  const { trackShow, trackEvent } = useZA();

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    triggerOnce: true,
    threshold: 0.5
  });
  // Removed local showClearImage usage now that images rely solely on API data

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
    lightUpMomentAndRefresh('annual_report');
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
  const liukanshanLookup = assets.yearly.liukanshanLookup;

  // Get annual_report status from API
  const annualReportStatus = userData?.momentLightList?.find(
    (item) => item.position === 'annual_report'
  );

  // Get the image URL to display based on status
  const displayedImageUrl = annualReportStatus
    ? (annualReportStatus.light_status === 1
        ? annualReportStatus.light_image_url
        : annualReportStatus.un_light_image_url)
    : undefined;

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
              <source src={liukanshanLookup.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="absolute bottom-[5.5%] right-[8%] z-50 w-[65px] h-[50px] overflow-hidden rounded-[2px]">
          {displayedImageUrl && (
            <div className="relative w-full h-full">
              <Image
                key={displayedImageUrl}
                src={displayedImageUrl}
                alt={annualReportStatus?.light_status === 1 ? "annual report clear" : "annual report blur"}
                fill
                className="object-cover transition-opacity duration-500 ease-in-out"
              />
            </div>
          )}
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

