"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const clipPathleft = 'polygon(43% 0, 50% 19%, 100% 20%, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 0)';
const clipPathright = 'polygon(50% 20%, 57% 0, 100% 0, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 20%)';

const FolderSection = () => {
  const { assets } = useAssets();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!assets) return null;

  const footerImg = assets.folders.footer;

  const folders = [
    {
      id: 0,
      asset: assets.folders.all[0],
      name: '嘉宾1',
      clipPath: clipPathleft,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
    {
      id: 1,
      asset: assets.folders.all[1],
      name: '嘉宾2',
      clipPath: clipPathright,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
    {
      id: 2,
      asset: assets.folders.all[2],
      name: '嘉宾3',
      clipPath: clipPathleft,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
    {
      id: 3,
      asset: assets.folders.all[3],
      name: '嘉宾4',
      clipPath: clipPathright,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
    {
      id: 4,
      asset: assets.folders.all[4],
      name: '嘉宾5',
      clipPath: clipPathleft,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
    {
      id: 5,
      asset: assets.folders.all[5],
      name: '嘉宾6',
      clipPath: clipPathright,
      url: 'https://www.zhihu.com/question/1974440788541793545'
    },
  ];

  const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>, index: number, url: string) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const elementHeight = rect.height;
    const clickPercentage = (clickY / elementHeight) * 100;

    // Only navigate if click is in the bottom 70% of the image (below 30% from top)
    if (clickPercentage >= 30 && url) {
      window.open(url, '_blank');
    } else {
      // Toggle active state for clicks in the top 30%
      setActiveIndex(activeIndex === index ? null : index);
    }
  };


  return (
    <div className="relative w-full z-100">
      <div className="relative w-full h-[165px] m-auto px-[16px]">
        {folders.map((folder, index) => {
          const zIndex = index;
          const topOffset = index * 16;
          const isActive = activeIndex === index;
          const { url, width, height, alt } = folder.asset as { url: string; width: number; height: number; alt: string };

          return (
            <div
              key={folder.id}
              onClick={(e) => handleFolderClick(e, index, folder.url)}
              className={`
                absolute left-[16px] right-[16px] mx-auto
                transition-transform duration-500 ease-out cursor-pointer
                ${isActive ? '-translate-y-[105px]' : 'translate-y-0'}
              `}
              style={{
                zIndex: zIndex,
                top: `${topOffset}px`,
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

      <div className="relative -mt-[54px] z-50 flex flex-col items-center justify-center">
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