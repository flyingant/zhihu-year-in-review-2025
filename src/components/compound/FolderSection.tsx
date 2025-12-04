"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';

const clipPathleft = 'polygon(43% 0, 50% 19%, 100% 20%, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 0)';
const clipPathright = 'polygon(50% 20%, 57% 0, 100% 0, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 20%)';
const TOP_POSITIONS = [
  'top-[0px]',
  'top-[16px]',
  'top-[32px]',
  'top-[48px]',
  'top-[64px]',
  'top-[80px]',
];

type FolderItem = {
  id: number;
  asset: { url: string; width: number; height: number; alt: string };
  name: string;
  clipPath: string;
  url: string;
};

const FolderSection = () => {
  const { assets } = useAssets();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (moduleInView) {
      // 埋点4
      trackShow({ moduleId: 'quote_module_2025', type: 'Block', page: { page_id: '60850', page_level: 1 } });
    }
  }, [moduleInView]);


  if (!assets) return null;

  const footerImg = assets.folders.footer;

  const folders = assets.folders.all.map((asset, index) => ({
    id: index,
    asset,
    name: asset.alt,
    clipPath: index % 2 === 0 ? clipPathleft : clipPathright,
    url: asset.jump_url || ''
  }));

  const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>, index: number, item: FolderItem) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const elementHeight = rect.height;
    const url = item.url;
    const clickPercentage = (clickY / elementHeight) * 100;

    // Only navigate if click is in the bottom 70% of the image (below 30% from top)
    if (clickPercentage >= 30 && url) {
      // 埋点7
      trackEvent('OpenUrl', {
        moduleId: 'quote_image_2025',
        type: 'Image',
        page: {
          page_id: '60850',
          page_level: 1,
        }
      }, {
        config_map: {
          user_name: item.name
        }
      });
      // Navigate to URL - wrapped in setTimeout to bypass React Compiler restriction
      setTimeout(() => {
        window.location.href = url;
      }, 0);
    } else {
      // Toggle active state for clicks in the top 30%
      const isExpanding = activeIndex !== index;
      setActiveIndex(activeIndex === index ? null : index);
      // 埋点5
      trackEvent('', {
        moduleId: 'quote_user_name_2025',
        type: 'Button',
        page: {
          page_id: '60850',
          page_level: 1,
        }
      }, {
        config_map: {
          user_name: item.name
        }
      });
      if (isExpanding) {
        // 埋点6
        trackShow({
          moduleId: 'quote_image_2025',
          type: 'Image',
          page: {
            page_id: '60850',
            page_level: 1,
          }
        }, {
          config_map: {
            user_name: item.name
          }
        });
      }
    }
  };


  return (
    <div ref={moduleRef} className="relative w-full z-100">
      <div className="relative w-full h-[165px] m-auto px-[16px]">
        {folders.map((folder, index) => {
          const zIndex = index;
          const isActive = activeIndex === index;
          const { url, width, height, alt } = folder.asset as { url: string; width: number; height: number; alt: string };
          const topClass = TOP_POSITIONS[index] || 'top-[0px]';
          return (
            <div
              key={folder.id}
              onClick={(e) => handleFolderClick(e, index, folder)}
              className={`
                absolute left-[16px] right-[16px] mx-auto ${topClass}
                transition-transform duration-500 ease-out cursor-pointer
                ${isActive ? '-translate-y-[105px]' : 'translate-y-0'}
              `}
              style={{
                zIndex: zIndex,
                clipPath: folder.clipPath,
                WebkitClipPath: folder.clipPath,
              }}
            >
              <Image
                src={url}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto drop-shadow-xl"
                draggable="false"
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>

      <div className="relative -mt-[50px] z-50 flex flex-col items-center justify-center">
        <div className="mb-2 px-[16px]
         after:content-[''] 
         after:absolute 
         after:bottom-0 
         after:left-0
         after:w-full 
         after:h-1/3
         after:bg-white
         after:-z-10  ">
          <Image src={footerImg.url} alt={footerImg.alt} width={footerImg.width} height={footerImg.height} className="w-full" priority />
        </div>
      </div>

    </div>
  );
};

export default FolderSection;