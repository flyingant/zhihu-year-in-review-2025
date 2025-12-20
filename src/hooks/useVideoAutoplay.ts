"use client";

import { useEffect, useState, RefObject } from 'react';

interface UseVideoAutoplayOptions {
  /** 是否启用自动播放，默认 true */
  enabled?: boolean;
}

interface UseVideoAutoplayReturn {
  /** 视频是否已成功播放 */
  hasPlayed: boolean;
}

/**
 * 视频自动播放 Hook
 * 处理移动端（特别是微信安卓）的视频自动播放兼容性问题
 * 
 * @param videoRef - video 元素的 ref
 * @param options - 配置选项
 * @returns { hasPlayed } - 播放状态
 * 
 * @example
 * ```tsx
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { hasPlayed } = useVideoAutoplay(videoRef);
 * 
 * return <video ref={videoRef} muted loop playsInline />;
 * ```
 */
export function useVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: UseVideoAutoplayOptions = {}
): UseVideoAutoplayReturn {
  const { enabled = true } = options;
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let hasPlayedLocal = false;

    // 检测是否是微信环境
    const isWeixin = /MicroMessenger/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isWeixinAndroid = isWeixin && isAndroid;

    // 手动设置非标准属性（JSX 不支持）
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('x5-playsinline', 'true');
    videoEl.setAttribute('x5-video-player-type', 'h5');
    videoEl.setAttribute('x5-video-player-fullscreen', 'false');
    videoEl.setAttribute('x-webkit-airplay', 'allow');
    videoEl.setAttribute('preload', 'auto');
    videoEl.setAttribute('playsinline', 'true');
    
    // 确保 muted 和 playsinline 属性设置正确
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.defaultMuted = true;
    // @ts-expect-error - 安卓 webkit 属性
    videoEl.webkitPlaysInline = true;

    // 尝试播放
    const attemptPlay = () => {
      if (hasPlayedLocal) return;
      
      // 确保视频是静音的
      videoEl.muted = true;
      videoEl.volume = 0;
      
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hasPlayedLocal = true;
          setHasPlayed(true);
          console.log('Video autoplay succeeded');
        }).catch((err) => {
          console.log('Video play failed:', err);
        });
      }
    };

    // 监听用户交互后播放（安卓微信回退方案）
    const playOnInteraction = () => {
      if (hasPlayedLocal) return;
      videoEl.muted = true;
      videoEl.play().then(() => {
        hasPlayedLocal = true;
        setHasPlayed(true);
        // 移除所有交互监听
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('touchend', playOnInteraction);
        document.removeEventListener('click', playOnInteraction);
      }).catch(() => {});
    };

    // 微信安卓特殊处理
    if (isWeixinAndroid) {
      console.log('Detected WeChat Android, using special handling');
      
      // 微信安卓必须等待 WeixinJSBridgeReady
      const weixinPlay = () => {
        if (window.WeixinJSBridge) {
          window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
            videoEl.load();
            setTimeout(() => {
              attemptPlay();
            }, 0);
          });
        } else {
          attemptPlay();
        }
      };

      if (window.WeixinJSBridge) {
        weixinPlay();
      } else {
        document.addEventListener('WeixinJSBridgeReady', weixinPlay, { once: true });
      }

      // 微信安卓必须监听用户交互
      document.addEventListener('touchstart', playOnInteraction, { passive: true });
      document.addEventListener('touchend', playOnInteraction, { passive: true });
      document.addEventListener('click', playOnInteraction);
      
    } else {
      // 非微信安卓环境
      const onCanPlay = () => attemptPlay();
      const onLoadedData = () => attemptPlay();

      videoEl.addEventListener('canplay', onCanPlay);
      videoEl.addEventListener('loadeddata', onLoadedData);
      
      // 微信 iOS 或其他环境
      if (window.WeixinJSBridge) {
        window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
          videoEl.load();
          attemptPlay();
        });
      } else {
        document.addEventListener('WeixinJSBridgeReady', () => {
          videoEl.load();
          attemptPlay();
        }, { once: true });
      }

      // 初始尝试播放
      videoEl.load();
      setTimeout(attemptPlay, 100);
      setTimeout(attemptPlay, 500);

      // 也添加交互监听作为回退
      document.addEventListener('touchstart', playOnInteraction, { passive: true });
      document.addEventListener('click', playOnInteraction);
    }

    return () => {
      document.removeEventListener('touchstart', playOnInteraction);
      document.removeEventListener('touchend', playOnInteraction);
      document.removeEventListener('click', playOnInteraction);
    };
  }, [videoRef, enabled]);

  return {
    hasPlayed,
  };
}

export default useVideoAutoplay;
