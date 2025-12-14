"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Player from 'griffith';
import { useAssets } from '@/context/assets-context';
import { useInView } from 'react-intersection-observer';
import { getVideoDetails, VideoDetailResponse, extractVideoPlayUrl, extractVideoQualityUrls } from '@/api/video';

const NianZhongXiaoWenSection = () => {
  const { assets } = useAssets();
  const videoId = assets?.urls?.nianZhongXiaoWenVideoID || '';
  const playerContainerRef = useRef<HTMLDivElement>(null);
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
    if (!videoId) return;

    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const details = await getVideoDetails(videoId);
        setVideoDetails(details);
        
        // Extract video URL from response using helper function
        const url = extractVideoPlayUrl(details);
        if (url) {
          setVideoUrl(url);
        } else {
          // No fallback - video URL must come from API
          setVideoUrl('');
        }
      } catch (err) {
        console.error('Failed to fetch video details:', err);
        setError('Failed to load video');
        // No fallback - video URL must come from API
        setVideoUrl('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [assets, videoId]);

  // Handle viewport visibility for pause when leaving viewport
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    // Find the video element inside Griffith player
    const findVideoElement = (): HTMLVideoElement | null => {
      return playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
    };

    // Only pause when leaving viewport (no auto-play)
    if (!inView) {
      // 离开视口暂停
      const videoElement = findVideoElement();
      if (videoElement) {
        videoElement.pause();
      }
    }
  }, [inView, videoUrl]);

  // Listen for play events from Griffith player
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    let videoElement: HTMLVideoElement | null = null;
    let attempts = 0;

    const findAndAttachListener = () => {
      videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement) {
        const handlePlay = () => {
          // Ensure video is visible when playing
          videoElement?.style.setProperty('opacity', '1');
          // Hide any poster/overlay elements
          const posterElements = playerContainerRef.current?.querySelectorAll('[class*="poster"], [class*="overlay"]');
          posterElements?.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });
          // trackEvent('Play', { moduleId: 'nianzhong_video_2025', type: 'Button' });
        };
        const handlePause = () => {
          // trackEvent('Pause', { moduleId: 'nianzhong_video_2025', type: 'Button' });
        };

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        videoElement.addEventListener('playing', handlePlay); // Also handle 'playing' event
        
        return () => {
          videoElement?.removeEventListener('play', handlePlay);
          videoElement?.removeEventListener('pause', handlePause);
          videoElement?.removeEventListener('playing', handlePlay);
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

  // Handle click on player container to ensure video plays and hide poster
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    const hidePosterAndOverlay = () => {
      // Hide poster and overlay elements
      const posterElements = playerContainerRef.current?.querySelectorAll(
        '.griffith-poster, [class*="poster"], [class*="overlay"]'
      );
      posterElements?.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Ensure video is visible
      const videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement) {
        videoElement.style.opacity = '1';
      }
    };

    const handleContainerClick = () => {
      // Find the video element
      const videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement && videoElement.paused) {
        // If video is paused, try to play it
        videoElement.play().catch((err) => {
          console.error('Failed to play video on click:', err);
        });
      }
      // Hide poster/overlay when clicked
      setTimeout(hidePosterAndOverlay, 100);
    };

    const container = playerContainerRef.current;
    container.addEventListener('click', handleContainerClick);
    
    // Also hide poster when video starts playing
    const videoElement = playerContainerRef.current.querySelector('video') as HTMLVideoElement | null;
    if (videoElement) {
      const handlePlaying = () => {
        hidePosterAndOverlay();
      };
      videoElement.addEventListener('playing', handlePlaying);
      videoElement.addEventListener('play', handlePlaying);
      
      return () => {
        container.removeEventListener('click', handleContainerClick);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('play', handlePlaying);
      };
    }
    
    return () => {
      container.removeEventListener('click', handleContainerClick);
    };
  }, [videoUrl]);

  if (!assets) return null;

  const bgAsset = assets.nianZhongXiaoWen.bg;

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col items-center">
      <div className="relative w-full">
        <div
          ref={playerContainerRef}
          className="absolute overflow-hidden rounded-[4px] z-20 bg-black"
          style={{
            top: '30%',
            left: '9%',
            width: '82%',
            height: '58%',
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
            <div className="w-full h-full [&>div]:w-full [&>div]:h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:opacity-100">
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
        <div className="relative z-30 pointer-events-none">
          <Image
            src={bgAsset.url}
            alt={bgAsset.alt}
            width={bgAsset.width}
            height={bgAsset.height}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
};

export default NianZhongXiaoWenSection;