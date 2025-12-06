"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Player from 'griffith';
import { useAssets } from '@/context/assets-context';
import { useInView } from 'react-intersection-observer';
import { getVideoDetails, VideoDetailResponse, extractVideoPlayUrl, extractVideoQualityUrls } from '@/api/video';

const VIDEO_ID = "1855624605156438016";

const NianZhongXiaoWenSection = () => {
  const { assets } = useAssets();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetailResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView } = useInView({ triggerOnce: true });

  // 埋点：模块曝光
  useEffect(() => {
    if (inView) {
      // trackShow({ moduleId: 'annual_video_2025', type: 'Block' });
    }
  }, [inView]);

  // Prepare sources for Griffith Player with quality-specific URLs if available
  const playerSources = videoDetails ? (() => {
    const qualityUrls = extractVideoQualityUrls(videoDetails);
    if (qualityUrls.hd || qualityUrls.sd) {
      return {
        ...(qualityUrls.hd && { hd: { play_url: qualityUrls.hd } }),
        ...(qualityUrls.sd && { sd: { play_url: qualityUrls.sd } }),
      };
    }
    // Fallback to single URL if no quality-specific URLs
    return videoUrl ? {
      hd: { play_url: videoUrl },
      sd: { play_url: videoUrl },
    } : null;
  })() : (videoUrl ? {
    hd: { play_url: videoUrl },
    sd: { play_url: videoUrl },
  } : null);

  // Fetch video details on component mount
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const details = await getVideoDetails(VIDEO_ID);
        setVideoDetails(details);
        
        // Extract video URL from response using helper function
        const url = extractVideoPlayUrl(details);
        if (url) {
          setVideoUrl(url);
        } else {
          // Fallback to assets if API doesn't provide URL
          setVideoUrl(assets?.urls?.nianZhongXiaoWenVideo || '');
        }
      } catch (err) {
        console.error('Failed to fetch video details:', err);
        setError('Failed to load video');
        // Fallback to assets video URL on error
        setVideoUrl(assets?.urls?.nianZhongXiaoWenVideo || '');
      } finally {
        setIsLoading(false);
      }
    };

    if (assets) {
      fetchVideoDetails();
    }
  }, [assets]);

  // Listen for play events from Griffith player
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    let videoElement: HTMLVideoElement | null = null;
    let attempts = 0;

    const findAndAttachListener = () => {
      videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement) {
        const handlePlay = () => {
          setIsPlaying(true);
        };

        const handlePause = () => {
          setIsPlaying(false);
        };

        const handleEnded = () => {
          setIsPlaying(false);
        };

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('ended', handleEnded);
        
        return () => {
          videoElement?.removeEventListener('play', handlePlay);
          videoElement?.removeEventListener('pause', handlePause);
          videoElement?.removeEventListener('ended', handleEnded);
        };
      } else if (attempts < 20) {
        attempts++;
        setTimeout(findAndAttachListener, 100);
      }
      return undefined;
    };

    const cleanup = findAndAttachListener();
    return cleanup;
  }, [videoUrl]);

  const togglePlay = () => {
    if (!playerContainerRef.current) return;

    const videoElement = playerContainerRef.current.querySelector('video') as HTMLVideoElement | null;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPlaying(true);
        // 埋点：点击播放
        // trackEvent('Click', { moduleId: 'annual_video_play_2025', type: 'Button' });
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!assets) return null;

  const bgAsset = assets.nianZhongXiaoWen.bg;

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col items-center">
      <div className="relative w-full pl-[16px]">

        <div
          ref={playerContainerRef}
          className="absolute overflow-hidden rounded-[4px] z-10"
          style={{
            top: '36%',
            left: '9%',
            width: '82%',
            height: '58%',
            // background: 'red', // 调试用：打开红色背景来对齐位置
          }}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              <span>Loading video...</span>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              <span>{error}</span>
            </div>
          ) : playerSources ? (
            <div className="w-full h-full [&>div]:w-full [&>div]:h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
              {/* @ts-expect-error - Griffith Player type compatibility with React 19 */}
              <Player
                sources={playerSources}
                id="nianzhong-video-player"
                defaultQuality="hd"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
              <span>No video available</span>
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