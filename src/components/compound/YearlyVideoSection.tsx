"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Player from 'griffith';
import { useAssets } from '@/context/assets-context';
import { useElementCenter } from '@/hooks/useElementCenter';
import { getVideoDetails, VideoDetailResponse, extractVideoPlayUrl, extractVideoQualityUrls, extractVideoCoverImage } from '@/api/video';
import { useZA } from '@/hooks/useZA';
import { useUserData } from '@/context/user-data-context';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { completeTask, getCampaignInfo } from '@/api/campaign';
import { useGriffithSpeedFix } from '@/hooks/useGriffithSpeedFix'; 
import { GriffithSpeedStyle } from './GriffithSpeedStyle';

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
  const hasTrackedRef = useRef(false);
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();

  const { ref: setRefs, isCenter: showIcon, inView } = useElementCenter({
    triggerOnce: true,
    threshold: 0.8,
  });

  // Removed local showClearImage usage now that images rely solely on API data
  const [videoDetails, setVideoDetails] = useState<VideoDetailResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useGriffithSpeedFix(playerContainerRef, [videoUrl]);

  // Extract cover image from video details
  const coverImage = useMemo(() => {
    return videoDetails ? extractVideoCoverImage(videoDetails) : null;
  }, [videoDetails]);

  // Prepare sources for Griffith Player with quality-specific URLs if available
  const playerSources = useMemo(() => {
    if (videoDetails) {
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
    }
    return videoUrl ? {
      hd: { play_url: videoUrl, poster: coverImage },
      sd: { play_url: videoUrl, poster: coverImage },
    } : null;
  }, [videoDetails, videoUrl, coverImage]);

  useEffect(() => {
    if (inView && videoId && !hasTrackedRef.current) {
      const durationMs = (videoDetails?.video?.duration || 0) * 1000;

      trackShow({
        moduleId: 'annual_video_2025',
        type: 'Video',
        content: {
          type: 'Zvideo',
          token: videoId,
        },
        page: {
          page_id: '60850',
        }
      }, {
        media_info: {
          video_info: {
            video_id: videoId
          },
          duration: durationMs
        }
      });
      hasTrackedRef.current = true;
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

  const getPlayEventExtra = useCallback((videoEl: HTMLVideoElement | null) => {
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
  }, [videoDetails, videoId, playerSources]);


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
            },
            page: {
              page_id: '60850',
            }
          }, getPlayEventExtra(videoElement));

          // Call completeTask API and reload campaign data
          if (assets?.campaign) {
            completeTask(assets.campaign.completeTaskIds.BROWSE_2025_YEARLY_VIDEO)
              .then(() => {
                // Reload campaign data after successfully completing the task
                return getCampaignInfo(assets.campaign.activityId);
              })
              .catch((error) => {
                console.error('Error completing task BROWSE_2025_YEARLY_VIDEO or reloading campaign data:', error);
                // Silently fail - this is just tracking, don't block user flow
              });
          }
        };
        const handlePause = () => {
          trackEvent('Pause', {
            moduleId: 'annual_video_2025',
            type: 'Button',
            content: {
              type: 'Zvideo',
            },
            page: {
              page_id: '60850',
            }
          }, getPlayEventExtra(videoElement));
        };

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePause);
        return () => {
          videoElement?.removeEventListener('play', handlePlay);
          videoElement?.removeEventListener('pause', handlePause);
        };
      } else if (attempts < 20) {
        attempts++;
        setTimeout(findAndAttachListener, 100);
      }
      return undefined;
    };

    const cleanup = findAndAttachListener();
    return cleanup;
  }, [videoUrl, lightUpMomentAndRefresh, trackEvent, assets, getPlayEventExtra, coverImage]);

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

  const handleDiscuss = async () => {
    trackEvent('OpenUrl', {
      moduleId: 'annual_video_discussion',
      type: 'Button',
      content: {
        type: 'Answer',
        token: videoId
      },
      page: {
        page_id: '60850',
      }
    });

    // Redirect to yearlyVideoDiscussRedirectionURL if available
    const redirectUrl = assets?.urls?.yearlyVideoDiscussRedirectionURL;
    if (redirectUrl) {
      // Use zhihuHybrid if in zhihu app, otherwise use window.location.href
      if (isZhihuApp && isHybridAvailable) {
        try {
          await openURL(redirectUrl);
        } catch (error) {
          console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
          window.location.href = redirectUrl;
        }
      } else {
        window.location.href = redirectUrl;
      }
    }
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
      <GriffithSpeedStyle />
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          <div
            ref={playerContainerRef}
            className="absolute z-20 overflow-hidden bg-black rounded-[20px]"
            style={{
              top: '26.5%',
              left: '8%',
              width: '84%',
              height: '50%',
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
              <div className="w-full h-full relative [&>div]:!w-full [&>div]:!h-full [&_video]:!w-full [&_video]:!h-full [&_video]:!object-cover [&_video[poster]]:!object-cover [&_img]:!object-cover [&_img]:!w-full [&_img]:!h-full">
                {/* @ts-expect-error - Griffith Player type compatibility with React 19 */}
                <Player
                  sources={playerSources}
                  id="yearly-video-player"
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
            className={`absolute top-[14%] right-[2%] w-[72px] z-0 transition-transform duration-500 ease-out ${showIcon
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full'
              }`}
          >
            <Image
              src={liukanshanWaving.url}
              alt={liukanshanWaving.alt || "刘看山"}
              width={liukanshanWaving.width}
              height={liukanshanWaving.height}
              className="w-full h-auto object-contain"
              unoptimized
            />
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
            className="absolute bottom-[7%] right-[7%] w-[32%] h-[12%] z-30 cursor-pointer"
            onClick={() => handleDiscuss()}
          >
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyVideoSection;

