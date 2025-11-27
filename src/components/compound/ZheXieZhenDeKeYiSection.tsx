"use client";

import React from 'react';
import ZheXieZhenDeKeYi from '@/components/ui/ZheXieZhenDeKeYi';
import Image from 'next/image';
import { useUserData } from '@/context/user-data-context';

const ZheXieZhenDeKeYiSection = () => {
  const { userData } = useUserData();
  const realLinkItems = userData?.masterConfig?.real_link || [];
  
  // Use example image if array is empty
  const imagesToDisplay = realLinkItems.length > 0 
    ? realLinkItems 
    : [{ image_url: '/assets/real_link_example_1.png', jump_url: '' },{ image_url: '/assets/real_link_example_1.png', jump_url: '' },{ image_url: '/assets/real_link_example_1.png', jump_url: '' }];

  return (
    <div className="relative w-full flex flex-col items-center pb-7">
      {/* Title */}
      <div className="mb-4">
        <ZheXieZhenDeKeYi />
      </div>

      {/* Content - Column layout image list */}
      <div className="w-full max-w-[339px] flex flex-col items-center gap-4">
        {imagesToDisplay.map((item, index) => {
          const content = (
            <div key={index} className="relative w-full flex justify-center">
              <Image
                src={item.image_url}
                alt={`真实链接 ${index + 1}`}
                width={339}
                height={126}
                className="w-full h-auto object-contain"
                style={{ maxWidth: '339px' }}
              />
            </div>
          );

          return item.jump_url ? (
            <a
              key={index}
              href={item.jump_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              {content}
            </a>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
};

export default ZheXieZhenDeKeYiSection;

