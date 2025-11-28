"use client";

import React, { useRef, useEffect } from 'react';
import QinZiDa2025 from '@/components/ui/QinZiDa2025';
import Image from 'next/image';
import { useUserData } from '@/context/user-data-context';

const QinZiDa2025Section = () => {
  const { userData } = useUserData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selfAnswerItems = userData?.masterConfig?.self_answer || [];

  // Use example image if array is empty
  const imagesToDisplay = selfAnswerItems.length > 0
    ? selfAnswerItems
    : [{ image_url: '/assets/self_answer_example_1.png', jump_url: '' },
    { image_url: '/assets/self_answer_example_1.png', jump_url: '' },
    { image_url: '/assets/self_answer_example_1.png', jump_url: '' },
    { image_url: '/assets/self_answer_example_1.png', jump_url: '' },
    { image_url: '/assets/self_answer_example_1.png', jump_url: '' }
    ];

  // Enable horizontal scrolling with mouse wheel and drag
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    // Mouse wheel horizontal scrolling
    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY + e.deltaX;
      }
    };

    // Mouse drag scrolling
    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
          className="overflow-x-auto overflow-y-hidden hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            minWidth: '375px',
            maxWidth: '440px'
          }}
        >
          <div className="flex flex-row">
            {imagesToDisplay.map((item, index) => {
              const handleClick = () => {
                if (item.jump_url) {
                  window.location.href = item.jump_url;
                }
              };

              const content = (
                <div className="shrink-0 w-[148px] flex items-center justify-center">
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
              );

              return item.jump_url ? (
                <div
                  key={index}
                  onClick={handleClick}
                  className="shrink-0 cursor-pointer"
                >
                  {content}
                </div>
              ) : (
                <div key={index}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QinZiDa2025Section;

