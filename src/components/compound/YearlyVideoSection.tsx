"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';

const YearlyVideoSection = () => {
  const { assets } = useAssets();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if the component is in the middle of the screen
    const checkMiddlePosition = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      
      // Check if element center is near viewport center (within a threshold)
      const threshold = 100; // pixels tolerance
      const isInMiddle = Math.abs(elementCenter - viewportCenter) < threshold;
      
      if (isInMiddle) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        // Pause video when scrolling out of middle
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setHasStartedPlaying(false);
      }
    };

    // Initial check
    checkMiddlePosition();

    // Listen to scroll events
    window.addEventListener('scroll', checkMiddlePosition, { passive: true });
    window.addEventListener('resize', checkMiddlePosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkMiddlePosition);
      window.removeEventListener('resize', checkMiddlePosition);
    };
  }, []);

  useEffect(() => {
    // When animation completes (after 1s), start playing the video
    if (isVisible && !hasStartedPlaying) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video:', error);
          });
          setHasStartedPlaying(true);
        }
      }, 1000); // Wait for animation to complete (1 second)

      return () => clearTimeout(timer);
    }
  }, [isVisible, hasStartedPlaying]);

  if (!assets) return null;

  const videoBg = assets.yearly.videoBg;
  const liukanshanWaving = assets.yearly.liukanshanWaving;

  return (
    <div className="relative w-full flex flex-col items-center px-[16px]">
      <div 
        ref={containerRef}
        className="relative w-full flex flex-col items-center "
      >
        <div className="relative w-full flex items-center justify-center">
          {/* Background image */}
          <Image
            src={videoBg.url}
            alt={videoBg.alt}
            width={videoBg.width / 2}
            height={videoBg.height / 2}
            className="relative z-50 w-full h-auto object-contain"
            priority
          />
          {/* Video element over the frame */}
          <div
            className="absolute z-40 w-full"
            style={{
              top: '103px',
              left: '4px',
              height: '250px',
              backgroundColor: '#d7f1fe'
            }}
          >
            <video
              src={assets.urls.yearlyVideo}
              className="absolute z-40 object-contain"
              style={{ 
                top: '17px', 
                left: '16px', 
                width: '360px', 
                height: '230px',
                position: 'absolute'
              }}
              controls
              muted
              playsInline
              preload="auto"
            />
          </div>
          {/* Video element with slide-up/slide-down animation */}
          <div
            className={`absolute top-[50px] right-0 w-[72px] h-[72px] z-10 flex items-center justify-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0 ease-out' : 'opacity-0 translate-y-[150%] ease-in'
            }`}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain rounded-lg"
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={liukanshanWaving.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyVideoSection;

