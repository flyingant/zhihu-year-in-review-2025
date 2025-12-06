"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA'; // 假设你有埋点需求
import { useInView } from 'react-intersection-observer';

const NianZhongXiaoWenSection = () => {
  const { assets } = useAssets();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView } = useInView({ triggerOnce: true });

  // 埋点：模块曝光
  useEffect(() => {
    if (inView) {
      // trackShow({ moduleId: 'annual_video_2025', type: 'Block' });
    }
  }, [inView]);

  if (!assets) return null;

  const bgAsset = assets.nianZhongXiaoWen.bg;
  const videoUrl = assets.urls.nianZhongXiaoWenVideo;

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      // 埋点：点击播放
      // trackEvent('Click', { moduleId: 'annual_video_play_2025', type: 'Button' });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col items-center">
      <div className="relative w-full pl-[16px]">

        <div
          className="absolute overflow-hidden rounded-[4px] z-10"
          style={{
            top: '36%',
            left: '9%',
            width: '82%',
            height: '58%',
            // background: 'red', // 调试用：打开红色背景来对齐位置
          }}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            playsInline
            webkit-playsinline="true"
            onClick={togglePlay}
            onEnded={() => setIsPlaying(false)}
          />

          {/* 播放按钮遮罩 (未播放时显示) */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={togglePlay}
            >
              {/* 播放图标 (SVG) */}
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="w-full h-auto object-contain z-0 relative"
          priority
        />

      </div>
    </div>
  );
};

export default NianZhongXiaoWenSection;