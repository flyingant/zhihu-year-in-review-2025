"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

const clipPathleft = 'polygon(43% 0, 50% 19%, 100% 20%, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 0)';
const clipPathright = 'polygon(50% 20%, 57% 0, 100% 0, 100% 100%, 68% 100%, 32% 100%, 0 100%, 0% 43%, 0 20%)';

const FolderSection = () => {
  const footerImg = asset(assets.folders.footer);
  const footerSrc = typeof footerImg === 'string' ? footerImg : footerImg.url;

  const folders = [
    { 
      id: 0, 
      img: asset(assets.folders.all[0]), 
      name: '嘉宾1',
      clipPath: clipPathleft
    },
    { 
      id: 1, 
      img: asset(assets.folders.all[1]), 
      name: '嘉宾2',
      clipPath: clipPathright
    },
    { 
      id: 2, 
      img: asset(assets.folders.all[2]), 
      name: '嘉宾3',
      clipPath: clipPathleft
    },
    { 
      id: 3, 
      img: asset(assets.folders.all[3]), 
      name: '嘉宾4',
      clipPath: clipPathright
    },
    { 
      id: 4, 
      img: asset(assets.folders.all[4]), 
      name: '嘉宾5',
      clipPath: clipPathleft
    },
    { 
      id: 5, 
      img: asset(assets.folders.all[5]), 
      name: '嘉宾6',
      clipPath: clipPathright
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const handleFolderClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative w-full pb-20 z-100">
      <div className="relative w-full max-w-[343px] mx-auto h-[165px]">    
        {folders.map((folder, index) => {
          const zIndex = index;
          const topOffset = index * 15; 
          const isActive = activeIndex === index;
          const imgSrc = typeof folder.img === 'string' ? folder.img : folder.img.url;

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
                src={imgSrc} 
                alt={folder.name} 
                width={375}
                height={500}
                className="w-full h-auto drop-shadow-xl" 
                draggable="false"
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>

      <div className="relative z-50 flex flex-col items-center justify-center pb-10">
         <div className="w-[343px] mb-2
         after:content-[''] 
         after:absolute 
         after:bottom-0 
         after:left-0 
         after:w-full 
         after:h-1/2
         after:bg-white
         after:-z-10  ">
            <Image src={footerSrc} alt="点击名字查看真实瞬间" width={343} height={135} className="w-full" />
         </div>
      </div>

    </div>
  );
};

export default FolderSection;