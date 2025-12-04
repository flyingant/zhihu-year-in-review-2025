"use client";

import React, { useRef, useEffect, useState } from 'react';
import QinZiDa2025 from '@/components/ui/QinZiDa2025';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';

interface ItemProps {
  item: { image_url: string; jump_url: string };
  index: number;
}

const QinZiDaItem = ({ item, index }: ItemProps) => {
  const { trackShow, trackEvent } = useZA();

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      //埋点15
      trackShow({ moduleId: 'personal_answer_block_2025', type: 'Button', page: { page_id: '60850', page_level: 1 } });
    }
  }, [inView, trackShow, index]);

  const handleClick = () => {
    //埋点16
    trackEvent('OpenUrl', {
      moduleId: 'personal_answer_2025',
      type: 'Button',
      moduleIndex: index,
      page: {
        page_id: '60850',
        page_level: 1,
      }
    });

    if (item.jump_url) {
      window.location.href = item.jump_url;
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="shrink-0 cursor-pointer"
    >
      <div className="shrink-0 w-[148px] flex items-center justify-center pr-2">
        <div className="relative w-full flex justify-center">
          <Image
            src={item.image_url}
            alt={`亲自答 ${index + 1}`}
            width={339}
            height={126}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

const QinZiDa2025Section = () => {
  const { assets } = useAssets();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPC, setIsPC] = useState(false);

  // Check if viewport is PC (>= 768px)
  useEffect(() => {
    const checkViewport = () => {
      setIsPC(window.innerWidth >= 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // Enable horizontal scrolling with mouse wheel only
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Mouse wheel horizontal scrolling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Convert vertical wheel movement to horizontal scrolling
      // Use deltaX if available (horizontal scroll), otherwise use deltaY (vertical scroll)
      container.scrollLeft += e.deltaX || e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (!assets) return null;

  const imagesToDisplay = (assets.newImages.qingZiDa || []).map(item => ({
    image_url: item.url,
    jump_url: item.jump_url || ''
  }));

  return (
    <div className="relative w-full flex flex-col pb-12">
      {/* Title */}
      <div className="mb-4">
        <QinZiDa2025 />
      </div>

      {/* Horizontal scrollable image list */}
      <div className="w-full flex justify-center">
        <div
          ref={scrollContainerRef}
          className={`overflow-x-auto overflow-y-hidden ${!isPC ? 'hide-scrollbar' : ''}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            width: '100%',
          }}
        >
          <div className="flex flex-row pl-4">
            {imagesToDisplay.map((item, index) => (
              <QinZiDaItem
                key={index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QinZiDa2025Section;

