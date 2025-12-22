'use client';

import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface PageProps {
  onNext?: () => void;
  onPrevious: () => void;
  sceneName?: string;
}

export default function P27Scene({ onNext, onPrevious, sceneName }: PageProps) {
  const { assets } = useAssets();
  const [isSceneFading, setIsSceneFading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [gifSrc, setGifSrc] = useState<string>(assets?.report.topSpiningInfinit?.url || '');
  const [showEndFrame, setShowEndFrame] = useState(false);

  const top2025Asset = assets?.report.top2025;
  const top2026Asset = assets?.report.top2026;
  const topSpiningStopEndAsset = assets?.report.topSpiningStopEnd;
  const topSpiningStopAsset = assets?.report.topSpiningStop;


  const handleTop2025Click = () => {
    if (isButtonClicked) return; // Prevent multiple clicks

    setIsButtonClicked(true);

    // Fade out the whole scene and go to next page
    setIsSceneFading(true);
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 1000); // Wait for fade animation
  };

  const handleTop2026Click = () => {
    if (isButtonClicked) return; // Prevent multiple clicks

    setIsButtonClicked(true);

    setGifSrc(topSpiningStopAsset?.url || '');
    setTimeout(() => {
      setIsSceneFading(true);
      setShowEndFrame(true)
      setTimeout(() => {
        if (onNext) {
          onNext();
        }
      }, 1000); // Wait for fade animation
    }, 4900)
  };


  if (!assets) return null;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      {/* Wrapper to fade out the whole scene */}
      <div
        className='w-full h-full transition-opacity duration-1000 ease-in-out'
        style={{
          opacity: isSceneFading ? 0 : 1,
        }}
      >
        {/* content */}
        <div
          className='absolute z-[110] leading-relaxed w-full'
          style={{
            fontSize: 16,
            top: '114px',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingLeft: '40px',
            paddingRight: '40px',
            boxSizing: 'border-box',
          }}
        >
          <p style={{ fontSize: 24, textAlign: 'center' }}>
            这一年，真的要过去了
            <br />
            时间会被打包
            <br />
            记忆将会存档
            <br />
            留下一份属于你 2025 的「真实源文件」
            <br />
            如果有机会，你会希望
            <br />
          </p>
        </div>

        <img src={gifSrc} alt='spining' style={{ width: '100%', height: '100%', objectFit: 'cover', visibility: showEndFrame ? 'hidden' : 'visible', zIndex: showEndFrame ? -99 : 1 }} />
        <Image
          src={topSpiningStopEndAsset.url}
          alt={topSpiningStopEndAsset.alt}
          width={topSpiningStopEndAsset.width}
          height={topSpiningStopEndAsset.height}
          style={{
            width: '100%',
            height: '100%',
            visibility: showEndFrame ? 'visible' : 'hidden',
            zIndex: showEndFrame ? 1 : -99,
            objectFit: 'cover',
            transform: 'translateY(-100%)'
          }}
        />
        
        {/* Fixed position buttons at the bottom - always on top of video */}
        <div className='absolute bottom-0 left-0 right-0 z-[200] flex items-center justify-center px-4 pb-4'>
          {/* Left button - top2025 */}
          {top2025Asset && (
            <button
              onClick={handleTop2025Click}
              disabled={isButtonClicked}
              className='cursor-pointer mx-4'
              style={{
                pointerEvents: isButtonClicked ? 'none' : 'auto',
                opacity: isButtonClicked ? 0.5 : 1,
              }}
            >
              <Image
                src={top2025Asset.url}
                alt={top2025Asset.alt}
                width={top2025Asset.width / 6}
                height={top2025Asset.height / 6}
                className='object-contain'
              />
            </button>
          )}

          {/* Right button - top2026 */}
          {top2026Asset && (
            <button
              onClick={handleTop2026Click}
              disabled={isButtonClicked}
              className='cursor-pointer mx-4'
              style={{
                pointerEvents: isButtonClicked ? 'none' : 'auto',
                opacity: isButtonClicked ? 0.5 : 1,
              }}
            >
              <Image
                src={top2026Asset.url}
                alt={top2026Asset.alt}
                width={top2026Asset.width / 6}
                height={top2026Asset.height / 6}
                className='object-contain'
              />
            </button>
          )}
        </div>
      </div>
    </BaseScene>
  );
}
