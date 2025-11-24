"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

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

const GameSection = () => {
  const consoleBgAsset = asset(assets.games.consoleBg) as { url: string; alt: string };
  const titleAsset = asset(assets.games.title) as { url: string; alt: string; width: number; height: number };
  const liukanshanAsset = asset(assets.games.liukanshan) as { url: string; alt: string };
  const failAsset = asset(assets.games.fail) as { url: string; alt: string };
  const successAsset = asset(assets.games.success) as { url: string; alt: string };
  const bottomBannerAsset = asset(assets.games.bottomBanner) as { url: string; alt: string };

  const [status, setStatus] = useState('idle');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const mirrorRef = useRef<HTMLDivElement>(null);;

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
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      setStatus(isSuccess ? 'success' : 'error');
    }, 3000);
  };

  const handleRetry = () => {
    setStatus('loading');
    setTimeout(() => setStatus('success'), 3000);
  };

  // todo: 保存图片
  const handleSaveImage = () => {
    console.log('Saving image...');
    setStatus('idle');
  };
  // todo: 同步想法
  const handleSyncIdea = () => {
    console.log('Syncing idea...');
    setStatus('idle');
  };
  // todo: 写下真实瞬间跳转
  const handleMoreMoments = () => {
    console.log('More moments...');
    setStatus('idle');
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
          <div className="fixed z-[9999] inset-0 h-[100vh] bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
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
      <div className="relative w-full max-w-[333px] h-[50px] mt-5" onClick={handleMoreMoments}>
        <Image
          src={bottomBannerAsset.url}
          alt={bottomBannerAsset.alt}
          fill
          className="object-contain"
        />
      </div>
      {/* 失败弹框 */}
      {status === 'error' && (
        <div className="fixed z-[9999] inset-0 h-[100vh] z-50 flex items-center justify-center bg-black/70 animate-overlayShow">
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
              onClick={() => setStatus('idle')}
              className="absolute bottom-[6%] left-[6%] w-[88%] h-[13%] bg-transparent cursor-pointer active:opacity-50"
            ></div>
          </div>
        </div>
      )}
      {/* 成功弹框 */}
      {status === 'success' && (
        <div className="fixed z-[9999] inset-0 h-[100vh] z-50 flex flex-col items-center justify-center bg-black/80 animate-overlayShow">
          <div className="relative w-[300px] h-[500px] animate-contentShow">
            <Image
              src={successAsset.url}
              alt={successAsset.alt}
              fill
              className="object-contain"
            />
            <div
              className="absolute z-10 text-gray-800 text-sm leading-relaxed flex items-center justify-start break-all whitespace-pre-wrap overflow-hidden"
              style={{
                top: '40%',
                left: '12%',
                width: '76%',
                height: '25%',
                // background: 'rgba(255, 0, 0, 0.3)',
              }}
            >
              {inputValue || "这是用户输入的文字内容..."}
            </div>
            <div
              onClick={handleSaveImage}
              className="absolute bottom-[5%] left-[4%] w-[40%] h-[8%] bg-transparent cursor-pointer active:opacity-50"
            // style={{ background: 'rgba(0, 255, 0, 0.3)' }}
            ></div>
            <div
              onClick={handleSyncIdea}
              className="absolute bottom-[5%] right-[4%] w-[40%] h-[8%] bg-transparent cursor-pointer active:opacity-50"
            // style={{ background: 'rgba(0, 0, 255, 0.3)' }}
            ></div>

          </div>
        </div>
      )}
    </div>
  );
};

export default GameSection; 