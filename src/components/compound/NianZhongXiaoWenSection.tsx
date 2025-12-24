"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Player from 'griffith';
import { useAssets } from '@/context/assets-context';
import { useInView } from 'react-intersection-observer';
import { getVideoDetails, VideoDetailResponse, extractVideoPlayUrl, extractVideoQualityUrls, extractVideoCoverImage } from '@/api/video';
import { useGriffithSpeedFix } from '@/hooks/useGriffithSpeedFix'; 
import { GriffithSpeedStyle } from './GriffithSpeedStyle';

const NianZhongXiaoWenSection = () => {
  const { assets } = useAssets();
  const videoId = assets?.urls?.nianZhongXiaoWenVideoID || '';
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetailResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useGriffithSpeedFix(playerContainerRef, [videoUrl]);


  // const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView } = useInView({ triggerOnce: true });

  // 埋点：模块曝光
  useEffect(() => {
    if (inView) {
      // trackShow({ moduleId: 'annual_video_2025', type: 'Block' });
    }
  }, [inView]);

  // Extract cover image from video details
  const coverImage = videoDetails ? extractVideoCoverImage(videoDetails) : null;

  // Prepare sources for Griffith Player with quality-specific URLs if available
  const playerSources = videoDetails ? (() => {
    const qualityUrls = extractVideoQualityUrls(videoDetails);
    const posterUrl = coverImage;
    if (qualityUrls.hd || qualityUrls.sd) {
      return {
        ...(qualityUrls.hd && { hd: { play_url: qualityUrls.hd, poster: posterUrl } }),
        ...(qualityUrls.sd && { sd: { play_url: qualityUrls.sd, poster: posterUrl } }),
      };
    }
    // Fallback to single URL if no quality-specific URLs
    return videoUrl ? {
      hd: { play_url: videoUrl, poster: posterUrl },
      sd: { play_url: videoUrl, poster: posterUrl },
    } : null;
  })() : (videoUrl ? {
    hd: { play_url: videoUrl, poster: coverImage },
    sd: { play_url: videoUrl, poster: coverImage },
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


  // Set video poster attribute and hide Griffith Player's built-in play button
  useEffect(() => {
    if (!playerContainerRef.current || !playerSources) return;

    const setPosterAndHidePlayButton = () => {
      // Set poster attribute directly on video element
      const videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement && coverImage) {
        videoElement.poster = coverImage;
        // Ensure video element uses object-cover for the poster
        videoElement.style.objectFit = 'cover';
      }

      // Find and hide Griffith Player's play button
      const playButtons = playerContainerRef.current?.querySelectorAll(
        '[class*="play-button"], [class*="PlayButton"], [class*="playButton"], button[class*="play"], [aria-label*="play" i], [aria-label*="Play" i]'
      );
      playButtons?.forEach((button) => {
        const element = button as HTMLElement;
        // Only hide if it's not our custom play button
        if (!element.closest('.z-20')) {
          element.style.display = 'none';
        }
      });

      // Also hide any poster overlay play buttons
      const posterPlayButtons = playerContainerRef.current?.querySelectorAll(
        '.griffith-poster button, [class*="poster"] button, [class*="overlay"] button'
      );
      posterPlayButtons?.forEach((button) => {
        const element = button as HTMLElement;
        if (!element.closest('.z-20')) {
          element.style.display = 'none';
        }
      });
    };

    // Try to set poster and hide button immediately
    setPosterAndHidePlayButton();

    // Also try after a short delay to catch dynamically rendered elements
    const timeoutId = setTimeout(setPosterAndHidePlayButton, 100);
    const intervalId = setInterval(setPosterAndHidePlayButton, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [playerSources, coverImage]);

  if (!assets) return null;

  const bgAsset = assets.nianZhongXiaoWen.bg;

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col items-center">
      <GriffithSpeedStyle />
      <div className="relative w-full">
        <div
          ref={playerContainerRef}
          className="absolute overflow-hidden rounded-[4px] z-20 bg-black"
          style={{
            top: '30%',
            left: '9%',
            width: '82%',
            height: '59%',
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
            <div className="w-full h-full relative [&>div]:!w-full [&>div]:!h-full [&_video]:!w-full
              [&_video]:!h-full [&_video]:!object-cover [&_video]:opacity-100 [&_video[poster]]:!object-cover [&_img]:!object-cover [&_img]:!w-full [&_img]:!h-full">
              {/* @ts-expect-error - Griffith Player type compatibility with React 19 */}
              <Player
                sources={playerSources}
                id="nianzhong-video-player"
                defaultQuality="hd"
                cover={coverImage || undefined}
                locale="zh-Hans"
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