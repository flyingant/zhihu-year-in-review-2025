"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Player from 'griffith';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { getVideoDetails, VideoDetailResponse, extractVideoPlayUrl, extractVideoQualityUrls } from '@/api/video';
import { useZA } from '@/hooks/useZA';
import { useUserData } from '@/context/user-data-context';

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const YearlyVideoSection = () => {
  const { assets } = useAssets();
  const videoId = assets?.urls?.yearlyVideoID || '';
  const { userData, lightUpMomentAndRefresh } = useUserData();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { trackShow, trackEvent } = useZA();
  const playIdentifierRef = useRef<string>("");

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    triggerOnce: true,
    threshold: 0.5,
  });

  // Removed local showClearImage usage now that images rely solely on API data
  const [videoDetails, setVideoDetails] = useState<VideoDetailResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasStartedPlayingRef = useRef(false);

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

  useEffect(() => {
    if (inView && videoDetails && videoId) {
      const durationMs = (videoDetails.video?.duration || 0) * 1000;

      trackShow({
        moduleId: 'annual_video_2025',
        type: 'Video',
        content: {
          type: 'Zvideo',
          token: videoId,
        }
      }, {
        media_info: {
          video_info: {
            video_id: videoId
          },
          duration: durationMs
        }
      });
    }

  }, [inView, videoDetails, trackShow, videoId]);

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

  // Handle viewport visibility for auto-play/pause
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    // Find the video element inside Griffith player (with retry logic)
    const findVideoElement = (retries = 10): HTMLVideoElement | null => {
      const element = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (element || retries === 0) return element;
      // Retry after a short delay if element not found
      return null;
    };

    if (inView && !hasStartedPlayingRef.current) {
      // 延迟 1s 播放，并等待 Griffith 渲染完成
      const timer = setTimeout(() => {
        let attempts = 0;
        const tryPlay = () => {
          const videoElement = findVideoElement();
          if (videoElement) {
            // 大多数浏览器要求静音才能自动播放，或者需要用户交互
            // 这里尝试播放，如果失败（被浏览器拦截）则捕获错误
            videoElement.play().catch(() => {
              // 自动播放失败是正常的，静默处理
            });
            hasStartedPlayingRef.current = true;
          } else if (attempts < 10) {
            attempts++;
            setTimeout(tryPlay, 100);
          }
        };
        tryPlay();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!inView) {
      // 离开视口暂停
      const videoElement = findVideoElement();
      if (videoElement) {
        videoElement.pause();
      }
    }
  }, [inView, videoUrl]);

  const getPlayEventExtra = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) {
      return {
        media_info: {
          duration: (videoDetails?.video?.duration || 0) * 1000,
          progress_time: 0,
          video_quality: 'UNKNOWN',
          play_event_identifier: playIdentifierRef.current || generateRandomId(),
          video_info: {
            video_id: videoId,
            sound_rate: 1,
          }
        }
      };
    }

    const currentTimeMs = Math.floor(videoEl.currentTime * 1000);
    console.dir(videoEl, 8771122)
    if (!playIdentifierRef.current) {
      playIdentifierRef.current = generateRandomId();
    }
    // 根据playsource选择的视频链接决定是用的什么清晰度的视频
    let currentQuality = 'unknown';
    if (playerSources) {
      const currentSrc = videoEl.currentSrc;

      for (const [qualityKey, qualityData] of Object.entries(playerSources)) {
        if (qualityData && qualityData.play_url && currentSrc.includes(qualityData.play_url)) {
          currentQuality = qualityKey;
          break;
        }
        if (qualityData && qualityData.play_url === currentSrc) {
          currentQuality = qualityKey;
          break;
        }
      }
    }
    return {
      media_info: {
        duration: (videoDetails?.video?.duration || 0) * 1000,
        progress_time: currentTimeMs,
        video_quality: currentQuality.toUpperCase(),
        play_event_identifier: playIdentifierRef.current,
        video_info: {
          video_id: videoId,
          sound_rate: String(videoEl.playbackRate),
        }
      }
    };
  };


  // Listen for play events from Griffith player
  useEffect(() => {
    if (!playerContainerRef.current || !videoUrl) return;

    let videoElement: HTMLVideoElement | null = null;
    let attempts = 0;

    const findAndAttachListener = () => {
      videoElement = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
      if (videoElement) {
        const handlePlay = () => {
          lightUpMomentAndRefresh('annual_video');
          trackEvent('Play', {
            moduleId: 'annual_video_2025',
            type: 'Button',
            content: {
              type: 'Zvideo',
            }
          }, getPlayEventExtra(videoElement));
        };
        const handlePause = () => {
          trackEvent('Pause', {
            moduleId: 'annual_video_2025',
            type: 'Button',
            content: {
              type: 'Zvideo',
            }
          }, getPlayEventExtra(videoElement));
        };

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        return () => {
          videoElement?.removeEventListener('play', handlePlay);
        };
      } else if (attempts < 20) {
        attempts++;
        setTimeout(findAndAttachListener, 100);
      }
      return undefined;
    };

    const cleanup = findAndAttachListener();
    return cleanup;
  }, [videoUrl, lightUpMomentAndRefresh, trackEvent]);

  const handleDiscuss = () => {
    trackEvent('OpenUrl', {
      moduleId: 'annual_video_discussion',
      type: 'Button',
      content: {
        type: 'Answer',
        token: videoId
      }
    })
  };


  if (!assets) return null;

  const videoBg = assets.yearly.videoBg;
  const liukanshanWaving = assets.yearly.liukanshanWaving;

  // Get annual_video status from API
  const annualVideoStatus = userData?.momentLightList?.find(
    (item) => item.position === 'annual_video'
  );

  // Get the image URL to display based on status
  const displayedImageUrl = annualVideoStatus
    ? (annualVideoStatus.light_status === 1
        ? annualVideoStatus.light_image_url
        : annualVideoStatus.un_light_image_url)
    : undefined;

  return (
    <div ref={setRefs} className="relative w-full flex flex-col items-center">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          <div
            ref={playerContainerRef}
            className="absolute z-20 overflow-hidden bg-black rounded-[20px]"
            style={{
              top: '27.5%',
              left: '4.8%',
              width: '90.5%',
              height: '51%',
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
                  id="yearly-video-player"
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
              : 'translate-y-full'
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
            className="absolute bottom-[7%] left-[13%] w-[65px] h-[50px] z-40"
          >
            {displayedImageUrl && (
              <div className="relative w-full h-full">
                <Image
                  key={displayedImageUrl}
                  src={displayedImageUrl}
                  alt={annualVideoStatus?.light_status === 1 ? "annual video clear" : "annual video blur"}
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                />
              </div>
            )}
          </div>
          {/* // 右下角按钮遮罩 */}
          <div
            className="absolute bottom-[4%] right-[5%] w-[32%] h-[12%] z-30 cursor-pointer"
            onClick={() => handleDiscuss()}
          >
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyVideoSection;

