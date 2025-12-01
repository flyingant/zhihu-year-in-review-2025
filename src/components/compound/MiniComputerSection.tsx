"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { generateMomentPoster, publishMomentPin } from '@/api/campaign';
import { useToast } from '@/context/toast-context';
import { isZhihuApp } from '@/lib/zhihu-detection';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';

// Type declaration for Zhihu Hybrid SDK (new API pattern)
// Based on tech specs: window.zhihuHybrid('base/downloadImage').dispatch(params: Params): PromiseObservable<Result>
const useLoadingDots = (baseText: string, speed = 300, isActive: boolean) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isActive) return;

    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4; // 0, 1, 2, 3 循环
      setDots('.'.repeat(count));
    }, speed);

    return () => {
      clearInterval(interval);
      setDots('');
    };
  }, [speed, isActive]);

  return `${baseText}${dots}`;
};

const MiniComputerSection = () => {
  const { assets } = useAssets();
  const [status, setStatus] = useState('idle');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const { trackEvent, trackShow } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  const mirrorRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { downloadImage: downloadImageViaHybrid } = useZhihuHybrid();

  const loadingText = useLoadingDots("海报生成中", 400, status === 'loading');
  const HASHTAG = " #2025到底什么是真的";

  useEffect(() => {
    if (moduleInView) {
      // 埋点8
      trackShow({ moduleId: 'share_moment_2025', type: 'Block' });
    }
  }, [moduleInView]);

  useEffect(() => {
    if (status !== 'idle') {
      // 当有弹窗或加载时，禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复滚动
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [status]);

  if (!assets) return null;

  const consoleBgAsset = assets.games.consoleBg;
  const titleAsset = assets.games.title;
  const liukanshanAsset = assets.games.liukanshan;
  const failAsset = assets.games.fail;
  const bottomBannerAsset = assets.games.bottomBanner;
  const saveImageAsset = assets.games.saveImage;
  const syncIdeasAsset = assets.games.syncIdeas;

  const handleEnter = async () => {
    if (!inputValue.trim()) return;
    // 埋点10
    trackEvent('', {
      moduleId: 'share_moment_enter_2025',
      type: 'Button'
    });

    setStatus('loading');
    try {
      const response = await generateMomentPoster(inputValue);
      const img = new window.Image();
      img.src = response.poster_url;
      img.onload = () => {
        setPosterUrl(response.poster_url);
        setStatus('success');
      };
      img.onerror = () => {
        setStatus('error');
      };
    } catch (error) {
      console.error('Failed to generate poster:', error);
      const errorMessage = error && typeof error === 'object' && 'msg' in error
        ? String(error.msg)
        : '海报生成失败，请稍后重试';
      showToast(errorMessage, 'error');
      setStatus('error');
    }
  };

  const handleRetry = async () => {
    setStatus('loading');
    try {
      const response = await generateMomentPoster(inputValue);
      setPosterUrl(response.poster_url);
      setStatus('success');
    } catch (error) {
      console.error('Failed to generate poster:', error);
      const errorMessage = error && typeof error === 'object' && 'msg' in error
        ? String(error.msg)
        : '海报生成失败，请稍后重试';
      showToast(errorMessage, 'error');
      setStatus('error');
    }
  };

  const handleCloseSuccess = () => {
    setStatus('idle');
    setPosterUrl('');
    setInputValue('');
  };

  /**
   * 保存图片到本地
   * 如果在知乎 App 内，使用 zhihuHybrid SDK 下载图片
   * 否则使用标准的 JavaScript 下载方法
   */
  const handleSaveImage = async () => {
    if (!posterUrl) {
      showToast('没有可保存的图片', 'error');
      return;
    }

    // 检测是否在知乎 App 内
    if (isZhihuApp()) {
      try {
        // 在知乎 App 内，使用 Hybrid SDK 下载图片
        await downloadImageViaHybrid(posterUrl);
        showToast('图片保存成功', 'success');
      } catch (error) {
        console.error('Failed to save image via zhihuHybrid:', error);
        // 如果 zhihuHybrid 失败，降级到标准下载方法
        await downloadImageStandard(posterUrl);
      }
    } else {
      // 不在知乎 App 内，使用标准下载方法
      await downloadImageStandard(posterUrl);
    }
  };

  /**
   * 标准的图片下载方法（用于非知乎 App 环境）
   * 使用 canvas 方法绕过 CORS 限制
   */
  const downloadImageStandard = async (imageUrl: string) => {
    try {
      // 方法1: 尝试使用 canvas（需要服务器支持 CORS）
      const tryCanvasMethod = (): Promise<Blob> => {
        return new Promise<Blob>((resolve, reject) => {
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }
              
              ctx.drawImage(img, 0, 0);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to convert canvas to blob'));
                }
              }, 'image/png');
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => reject(new Error('Failed to load image with CORS'));
          img.src = imageUrl;
        });
      };

      // 方法2: 直接使用 fetch（如果 canvas 方法失败）
      const tryFetchMethod = async (): Promise<Blob> => {
        const response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        
        return await response.blob();
      };

      // 方法3: 使用代理或直接链接下载（最后的降级方案）
      const tryDirectDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `poster-${Date.now()}.png`;
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      let blob: Blob;
      
      try {
        // 首先尝试 canvas 方法
        blob = await tryCanvasMethod();
      } catch (canvasError) {
        console.warn('Canvas method failed, trying fetch:', canvasError);
        try {
          // 如果 canvas 失败，尝试 fetch
          blob = await tryFetchMethod();
        } catch (fetchError) {
          console.warn('Fetch method failed, using direct download:', fetchError);
          // 如果都失败，使用直接下载（可能在某些浏览器中不工作）
          tryDirectDownload();
          return;
        }
      }

      // 如果成功获取到 blob，创建下载链接
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `poster-${Date.now()}.png`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      showToast('图片保存成功', 'success');
    } catch (error) {
      console.error('Failed to download image:', error);
      showToast('保存失败，请稍后重试', 'error');
    }
  };
  // 同步想法
  const handleSyncIdea = async () => {
    if (!inputValue.trim() || !posterUrl) {
      showToast('缺少必要信息，无法发布', 'error');
      return;
    }
    //埋点11
    trackEvent('Pin', {
      moduleId: 'share_moment_share_pin_2025',
      type: 'Button',
      content: { type: 'Pin' }
    });

    try {
      await publishMomentPin(inputValue.trim(), posterUrl);
      showToast('发布成功', 'success');
    } catch (error) {
      console.error('Failed to publish moment:', error);
      const errorMessage = error && typeof error === 'object' && 'msg' in error
        ? String(error.msg)
        : '发布失败，请稍后重试';
      showToast(errorMessage, 'error');
    }
  };


  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (mirrorRef.current) {
      mirrorRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleBannerClick = () => {
    //埋点9
    trackEvent('OpenUrl', {
      moduleId: 'share_moment_question_2025',
      type: 'Button'
    });

    window.location.href = 'https://www.zhihu.com/question/1974440788541793545';
  };

  return (
    <div ref={moduleRef} className="relative flex flex-col pt-7 -mb-[20px] overflow-hidden">
      <div className="relative w-full flex justify-center pr-[16px] -mb-[24px]">
        <Image
          src={titleAsset.url}
          alt={titleAsset.alt}
          width={titleAsset.width}
          height={titleAsset.height}
          className="h-auto object-contain"
        />
      </div>

      <div className="relative w-full mx-auto h-[220px]">
        <Image
          src={consoleBgAsset.url}
          alt={consoleBgAsset.alt}
          fill
          className="object-contain z-0"
          priority
        />
        {/* 电脑输入框 */}
        <div className="absolute z-10 top-[20%] left-[14%] w-[74%] h-[30%]">
          <div
            ref={mirrorRef}
            className="w-full h-full overflow-hidden text-sm leading-relaxed pointer-events-none"
          >
            <div className="flex flex-col items-start w-full">
              {inputValue ? (
                <span className="text-gray-600 whitespace-pre-wrap break-all">
                  {inputValue}
                </span>
              ) : (
                <div className="flex items-center">
                  <div
                    className={`
                      w-[2px] h-[16px] mt-[2px]
                      ${!isFocused
                        ? 'bg-gray-400 animate-[blink_1s_step-end_infinite]'
                        : 'bg-transparent'
                      }
                    `}
                  ></div>
                  <span className="text-gray-300">写下你的 2025 真实瞬间</span>
                </div>
              )}
              <span className="text-[#2faeef] font-bold">
                {HASHTAG}
              </span>
            </div>
          </div>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onScroll={handleScroll}
            disabled={status !== 'idle'}
            maxLength={120}
            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-transparent caret-gray-600 text-sm leading-relaxed z-10"
          />
        </div>
        {/* enter遮罩层 */}
        <div className="absolute bottom-[10%] right-[8%] w-[35%] h-[15%] z-10">
          <div
            onClick={handleEnter}
            className="absolute inset-0 cursor-pointer active:scale-95 transition-transform bg-transparent"
          ></div>
        </div>
        {/* loading动画 */}
        {status === 'loading' && (
          <div className="fixed z-[9999] inset-0 h-screen bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="relative w-[74px] h-[104px]">
              <Image
                src={liukanshanAsset.url}
                alt="Loading"
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-cyan-400 text-xl font-bold tracking-widest h-[30px]">
              {loadingText}
            </div>
          </div>
        )}
      </div>
      {/* 写下更多真实瞬间按钮 */}
      <div
        onClick={handleBannerClick}
        className="relative w-full  mx-auto h-[50px] mt-5 block cursor-pointer z-1"
      >
        <Image
          src={bottomBannerAsset.url}
          alt={bottomBannerAsset.alt}
          fill
          className="object-contain"
        />
      </div>
      {/* 失败弹框 */}
      {status === 'error' && (
        <div className="fixed z-[9999] inset-0 h-screen flex items-center justify-center bg-black/70 animate-overlayShow">
          <div className="relative w-[219px] h-[298px] animate-contentShow mt-[-60px]">
            <Image
              src={failAsset.url}
              alt={failAsset.alt}
              fill
              className="object-contain"
            />
            <div
              onClick={handleRetry}
              className="absolute bottom-[24%] left-[6%] w-[88%] h-[13%] bg-transparent cursor-pointer active:opacity-50"
            ></div>
            <div
              onClick={() => {
                setStatus('idle');
                setPosterUrl('');
              }}
              className="absolute bottom-[6%] left-[6%] w-[88%] h-[13%] bg-transparent cursor-pointer active:opacity-50"
            ></div>
          </div>
        </div>
      )}
      {/* 成功弹框 */}
      {status === 'success' && posterUrl && (
        <div className="fixed z-[9999] inset-0 h-screen flex flex-col items-center justify-center bg-black/80 animate-overlayShow">
          <div className="relative flex flex-col items-center gap-4 animate-contentShow max-w-[300px]">
            {/* Close button */}
            <button
              onClick={handleCloseSuccess}
              className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white hover:opacity-70 transition-opacity z-30"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={posterUrl}
              alt="Generated poster"
              className="w-full h-auto object-contain"
            />
            <div className="flex gap-4 w-full px-2">
              <div
                onClick={handleSaveImage}
                className="flex-1 cursor-pointer active:opacity-50"
              >
                <Image
                  src={saveImageAsset.url}
                  alt={saveImageAsset.alt}
                  width={saveImageAsset.width}
                  height={saveImageAsset.height}
                  className="w-full h-auto object-contain"
                  unoptimized
                />
              </div>
              <div
                onClick={handleSyncIdea}
                className="flex-1 cursor-pointer active:opacity-50"
              >
                <Image
                  src={syncIdeasAsset.url}
                  alt={syncIdeasAsset.alt}
                  width={syncIdeasAsset.width}
                  height={syncIdeasAsset.height}
                  className="w-full h-auto object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniComputerSection;

