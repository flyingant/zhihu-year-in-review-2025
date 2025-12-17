'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { submitQuizAnswer } from '@/api/report';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P14Scene({ onNext, sceneName }: PageProps) {
  const [maskPosition, setMaskPosition] = useState(460);
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskPosition(Number(e.target.value));
  };

  // Handle scroll/wheel events and touch events to change mask position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 10 : -10; // Scroll down increases, up decreases
      setMaskPosition((prev) => {
        const newValue = prev + delta;
        return Math.max(300, Math.min(0, newValue)); // Clamp between min and max
      });
    };

    // Touch event handlers for mobile devices
    let touchStartY = 0;
    let lastTouchY = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
        isTouching = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length !== 1) return;

      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchY;

      // Convert touch movement to mask position change
      // Moving down (positive deltaY) should increase mask position (move down)
      // Moving up (negative deltaY) should decrease mask position (move up)
      // Use actual deltaY for smoother, proportional movement
      // Scale factor of 1.0 means 1px touch = 1px mask movement
      const delta = deltaY;

      setMaskPosition((prev) => {
        const newValue = prev + delta;
        return Math.max(300, Math.min(0, newValue)); // Clamp between min and max
      });

      lastTouchY = currentY;
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const handleSelect = async (choice: 'A' | 'B') => {
    // call API to record the choice
    try {
      await submitQuizAnswer({
        question_id: 3,
        answer: choice,
      });
    } catch (error) {
      console.error('Failed to submit quiz answer:', error);
      // Continue to next scene even if API call fails
    }
    setUserChoice('p14', choice);
    onNext?.();
  };

  if (!assets) return null;

  const p14Assets = assets.report.p14 || {};
  const bgAsset = p14Assets.bg;
  const topAsset = p14Assets.top;
  const middleAsset = p14Assets.middle;

  const reportBg = assets.report.bg;
  const blue10Asset = reportBg.blue10;
  const mix3Asset = reportBg.mix3;
  const mix14Asset = reportBg.mix14;

  const isMaskPastThreshold = maskPosition < 460;
  const isMaskAboveThreshold = maskPosition > 460;
  const floatPulse = isMaskPastThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 1.2,
        ease: 'easeInOut' as const,
      }
    : undefined;
  const floatPulseB = isMaskAboveThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 1.2,
        ease: 'easeInOut' as const,
      }
    : undefined;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div
        ref={containerRef}
        className='relative w-full h-full overflow-hidden'
        style={{ perspective: '1000px' }}
      >
        <GlitchLayer className='z-[40]'>
          <Image
            src={mix3Asset.url}
            alt={mix3Asset.alt}
            width={mix3Asset.width}
            height={mix3Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '80px', right: '-40px' }}
          />
          <Image
            src={blue10Asset.url}
            alt=''
            width={blue10Asset.width}
            height={blue10Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{
              top: '137px',
              left: '14px',
              transform: 'scale(0.8) rotate(180deg)',
            }}
          />
          <Image
            src={mix14Asset.url}
            alt=''
            width={mix14Asset.width}
            height={mix14Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ bottom: '105px', left: '0px' }}
          />
          <Image
            src={blue10Asset.url}
            alt=''
            width={blue10Asset.width}
            height={blue10Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{
              bottom: '47px',
              right: '12px',
              transform: 'rotate(180deg)',
            }}
          />
        </GlitchLayer>
        <p
          className='absolute z-30 text-center text-xl w-full leading-relaxed'
          style={{ top: '110px', fontSize: 24 }}
        >
          当你赞同时
          <br />
          你在回应什么？
        </p>
        <motion.p
          className='absolute z-[70] text-center text-xl text-r-yellow cursor-pointer'
          style={{
            width: '280px',
            top: '260px',
            left: '55px',
            pointerEvents: 'auto',
          }}
          animate={floatPulse}
          transition={floatPulseTransition}
          onClick={() => handleSelect('A')}
          role='button'
          tabIndex={0}
        >
          <span
            style={{
              width: '100%',
              display: 'inline-block',
              color: '#FE8BC5',
              marginLeft: 22,
            }}
          >
            A.一种&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;被理解的感觉
          </span>
        </motion.p>
        <motion.p
          className='absolute z-[70] text-center text-xl text-r-blue cursor-pointer'
          style={{
            width: '180px',
            bottom: '150px',
            right: '33px',
            pointerEvents: 'auto',
          }}
          animate={floatPulseB}
          transition={floatPulseTransitionB}
          onClick={() => handleSelect('B')}
          role='button'
          tabIndex={0}
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'rotate(-2deg) skewX(15deg) skewY(15deg)',
              transformStyle: 'preserve-3d',
              color: '#A49FFE',
            }}
          >
            B.一句说得对的道理
          </span>
        </motion.p>

        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className='relative z-10 w-auto h-full pointer-events-none select-none'
        />
        {/* Top layer with wiper mask effect using new middle image + vertical line gradient */}
        <div
          className='absolute inset-0 z-20 pointer-events-none'
          style={
            {
              maskImage: `url("${middleAsset.url}")`,
              WebkitMaskImage: `url("${middleAsset.url}")`,
              maskSize: 'auto 100%',
              maskRepeat: 'no-repeat',
              maskPosition: `center ${maskPosition}px`,
              WebkitMaskPosition: `center ${maskPosition}px`,
              maskMode: 'alpha',
            } as React.CSSProperties
          }
        >
          <Image
            src={topAsset.url}
            alt={topAsset.alt}
            width={topAsset.width}
            height={topAsset.height}
            className='w-full h-full pointer-events-none select-none'
          />
        </div>
        {/* Invisible range input for touch/mobile support - vertical orientation */}
        <input
          type='range'
          min='0'
          max='760'
          value={maskPosition}
          onChange={handleRangeChange}
          className='absolute inset-0 w-full h-full opacity-0 cursor-none z-50'
          style={{
            pointerEvents: 'auto',
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '100vh',
            height: '100vw',
            marginLeft: '-50vh',
            marginTop: '-50vw',
          }}
        />
      </div>
    </BaseScene>
  );
}
