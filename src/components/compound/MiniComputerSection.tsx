"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';
import { generateMomentPoster, publishMomentPin } from '@/api/campaign';
import { useToast } from '@/context/toast-context';

const useTypingEffect = (text: string, speed = 300, isActive: boolean) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % (text.length + 1);
      setDisplayedText(text.slice(0, index));
    }, speed);

    return () => {
      clearInterval(interval);
      setDisplayedText('');
    };
  }, [text, speed, isActive]);

  return displayedText;
};

const MiniComputerSection = () => {
  const consoleBgAsset = asset(assets.games.consoleBg) as { url: string; alt: string };
  const titleAsset = asset(assets.games.title) as { url: string; alt: string; width: number; height: number };
  const liukanshanAsset = asset(assets.games.liukanshan) as { url: string; alt: string };
  const failAsset = asset(assets.games.fail) as { url: string; alt: string };
  const bottomBannerAsset = asset(assets.games.bottomBanner) as { url: string; alt: string };
  const saveImageAsset = asset(assets.games.saveImage) as { url: string; alt: string; width: number; height: number };
  const syncIdeasAsset = asset(assets.games.syncIdeas) as { url: string; alt: string; width: number; height: number };

  const [status, setStatus] = useState('idle');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>('');

  const mirrorRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const loadingText = useTypingEffect("海报生成中...", 200, status === 'loading');
  const HASHTAG = " #2025到底什么是真的";

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

  const handleEnter = async () => {
    if (!inputValue.trim()) return;

    setStatus('loading');
    try {
      const response = await generateMomentPoster(inputValue.trim());
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

  const handleRetry = async () => {
    setStatus('loading');
    try {
      const response = await generateMomentPoster(inputValue.trim());
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

  // TODO: 保存图片功能待实现
  const handleSaveImage = () => {
    if (!posterUrl) {
      showToast('没有可保存的图片', 'error');
      return;
    }
    console.log('Poster URL:', posterUrl);
    showToast('保存功能开发中', 'info');
    // TODO: 实现图片保存功能
  };
  // 同步想法
  const handleSyncIdea = async () => {
    if (!inputValue.trim() || !posterUrl) {
      showToast('缺少必要信息，无法发布', 'error');
      return;
    }

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

  return (
    <div className="relative max-w-[343px] mx-auto flex flex-col items-center pt-7 pb-10 overflow-hidden">
      <div className="relative w-full max-w-[343px] flex justify-center pb-4 pl-16">
        <Image
          src={titleAsset.url}
          alt={titleAsset.alt}
          width={titleAsset.width}
          height={titleAsset.height}
          className="w-[272px] h-auto object-contain"
        />
      </div>

      <div className="relative w-full max-w-[343px] h-[220px]">
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
            <div className="relative w-[74px] h-[104px] animate-bounce">
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
      <a 
        href="https://www.zhihu.com/question/1974440788541793545" 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative w-full max-w-[333px] h-[50px] mt-5 block"
      >
        <Image
          src={bottomBannerAsset.url}
          alt={bottomBannerAsset.alt}
          fill
          className="object-contain"
        />
      </a>
      {/* 失败弹框 */}
      {status === 'error' && (
        <div className="fixed z-[9999] inset-0 h-screen flex items-center justify-center bg-black/70 animate-overlayShow">
          <div className="relative w-[219px] h-[298px] animate-contentShow">
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

