"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';


const YearlyVideoSection = () => {
  const { assets } = useAssets();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    threshold: 0.5,
  });

  const [showClearImage, setShowClearImage] = useState(false);

  const hasStartedPlayingRef = useRef(false);

  useEffect(() => {
    if (inView && !hasStartedPlayingRef.current) {
      // 延迟 1s 播放
      const timer = setTimeout(() => {
        if (videoRef.current) {
          // 大多数浏览器要求静音才能自动播放，或者需要用户交互
          // 这里尝试播放，如果失败（被浏览器拦截）则捕获错误
          videoRef.current.play().catch(() => {
            // 自动播放失败是正常的，静默处理
          });
          hasStartedPlayingRef.current = true;
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!inView && videoRef.current) {
      // 离开视口暂停
      videoRef.current.pause();
      hasStartedPlayingRef.current = true;
    }
  }, [inView]);

  const handleVideoPlay = () => {
    setShowClearImage(true);
  };

  useEffect(() => {
    if (inView && !hasStartedPlayingRef.current) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // 自动播放失败静默处理
          });
          setHasStartedPlaying(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!inView && videoRef.current) {
      videoRef.current.pause();
      hasStartedPlayingRef.current = true;
    }
  }, [inView]);

  if (!assets) return null;

  const videoBg = assets.yearly.videoBg;
  const liukanshanWaving = assets.yearly.liukanshanWaving;
  const blurryImage = assets.yearly.videoBlurImage;
  const clearImage = assets.yearly.videoClearImage;


  return (
    <div ref={setRefs} className="relative w-full flex flex-col items-center px-[16px] py-10">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          <div
            className="absolute z-20 overflow-hidden bg-black rounded-[20px]"
            style={{
              top: '27.5%',
              left: '4.8%',
              width: '90.5%',
              height: '51%',
            }}
          >
            <video
              ref={videoRef}
              src={assets.urls.yearlyVideo}
              className="w-full h-full object-cover"
              controls
              muted={false}
              playsInline
              preload="auto"
              onPlay={handleVideoPlay}
            />
          </div>
          <div className="relative z-10 pointer-events-none">
            <Image
              src={videoBg.url}
              alt={videoBg.alt}
              width={videoBg.width}
              height={videoBg.height}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          {/* Video element with slide-up/slide-down animation */}
          <div
            className={`absolute top-[14%] -right-[2%] w-[72px] z-0 transition-transform duration-500 ease-out ${showIcon
              ? 'translate-y-0 opacity-100'
              : 'translate-y-[100%]'
              }`}
          >
            <video
              className="w-full h-auto object-contain"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={liukanshanWaving.url} type="video/mp4" />
            </video>
          </div>
          <div
            className="absolute bottom-[3%] left-[9%] w-[20%] z-20"
          >
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
          {/* // 右下角按钮遮罩 */}
          <div
            className="absolute bottom-[4%] right-[5%] w-[32%] h-[12%] z-30 cursor-pointer"
            onClick={() => console.log('Go to discuss')}
          >
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyVideoSection;

