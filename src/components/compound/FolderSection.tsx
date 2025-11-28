"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const clipPathleft = 'polygon(43% 0, 50% 19%, 100% 20%, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 0)';
const clipPathright = 'polygon(50% 20%, 57% 0, 100% 0, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 20%)';

const FolderSection = () => {
  const { assets } = useAssets();

  if (!assets) return null;

  const footerImg = assets.folders.footer;

  const folders = [
    {
      id: 0,
      asset: assets.folders.all[0],
      name: '嘉宾1',
      clipPath: clipPathleft
    },
    {
      id: 1,
      asset: assets.folders.all[1],
      name: '嘉宾2',
      clipPath: clipPathright
    },
    {
      id: 2,
      asset: assets.folders.all[2],
      name: '嘉宾3',
      clipPath: clipPathleft
    },
    {
      id: 3,
      asset: assets.folders.all[3],
      name: '嘉宾4',
      clipPath: clipPathright
    },
    {
      id: 4,
      asset: assets.folders.all[4],
      name: '嘉宾5',
      clipPath: clipPathleft
    },
    {
      id: 5,
      asset: assets.folders.all[5],
      name: '嘉宾6',
      clipPath: clipPathright
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleFolderClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  return (
    <div className="relative w-full z-100">
      <div className="relative w-full max-w-[343px] mx-auto h-[165px]">
        {folders.map((folder, index) => {
          const zIndex = index;
          const topOffset = index * 16;
          const isActive = activeIndex === index;
          const { url, width, height, alt } = folder.asset as { url: string; width: number; height: number; alt: string };

          return (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(index)}
              className={`
                absolute left-0 right-0 mx-auto
                transition-transform duration-500 ease-out cursor-pointer
              `}
              style={{
                zIndex: zIndex,
                top: `${topOffset}px`,
                transform: isActive ? 'translateY(-112px)' : 'translateY(0)',
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
              <a
                href="https://www.zhihu.com/question/1974440788541793545"
                onClick={(e) => e.stopPropagation()}
                className="absolute z-10 cursor-pointer"
                style={{
                  top: '52%',
                  left: index % 2 === 0 ? '8%' : '42%',
                  width: '50%',
                  height: '35%',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="relative mt-[-54px] z-50 flex flex-col items-center justify-center">
        <div className="w-[343px] mb-2
         after:content-[''] 
         after:absolute 
         after:bottom-0 
         after:left-0 
         after:w-full 
         after:h-1/2
         after:bg-white
         after:-z-10  ">
          <Image src={footerImg.url} alt={footerImg.alt} width={footerImg.width} height={footerImg.height} className="w-full" />
        </div>
      </div>

    </div>
  );
};

export default FolderSection;