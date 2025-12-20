'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { submitQuizAnswer } from '@/api/report';

interface PageProps {
  onNext?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P21Scene({
  onNext,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();

  // Use motion value with spring physics for smooth, physics-based animation
  const maskPositionMotion = useMotionValue(-100);
  const maskPositionSpring = useSpring(maskPositionMotion, {
    stiffness: 50,
    damping: 15,
    mass: 1,
  });

  const [maskPosition, setMaskPosition] = useState(-100);

  // Sync motion value with state for maskPosition updates
  useEffect(() => {
    const unsubscribe = maskPositionSpring.on('change', (latest) => {
      setMaskPosition(Math.round(latest));
    });
    return unsubscribe;
  }, [maskPositionSpring]);

  // Create smooth physics-based shake animation
  useEffect(() => {
    let isAnimating = true;
    const startTime = Date.now();

    const createSmoothShakeAnimation = () => {
      const animate = () => {
        if (!isAnimating) return;

        const basePosition = -100;
        const shakeAmount = 350; // Shake amount

        // Use smooth sine wave oscillation for predictable, smooth motion
        const elapsed = (Date.now() - startTime) / 1000; // Time in seconds
        const frequency = 0.2; // Oscillation frequency (cycles per second) - lower = slower
        // Map sine wave from [-1, 1] to [0, shakeAmount] so it goes from basePosition to basePosition + shakeAmount
        const smoothOffset =
          ((Math.sin(elapsed * frequency * Math.PI * 2) + 1) / 2) * shakeAmount;
        const targetPosition = basePosition + smoothOffset;

        // Update motion value smoothly
        maskPositionMotion.set(targetPosition);

        requestAnimationFrame(animate);
      };

      animate();
    };

    createSmoothShakeAnimation();

    return () => {
      isAnimating = false;
    };
  }, [maskPositionMotion]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    maskPositionMotion.set(newValue);
  };

  const handleSelect = async (choice: 'A' | 'B') => {
    // call API to record the choice
    try {
      await submitQuizAnswer({
        question_id: 4,
        answer: choice,
      });
    } catch (error) {
      console.error('Failed to submit quiz answer:', error);
      setUserChoice('p21', choice);
      // Continue to next scene even if API call fails
    }
    onNext?.();
  };

  if (!assets) return null;

  const p21Assets = assets.report.p21;
  const bgAsset = p21Assets.bg;
  const topAsset = p21Assets.top;
  const middleAsset = p21Assets.middle;
  const liukanshanAsset = p21Assets.liukanshan;
  const { mix21_1, mix21_2, mix21_3, mix21_4 } = assets.report.bg;

  return (
    <BaseScene
      onNext={onNext}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      <div className='relative w-full h-full overflow-hidden'>
        <div className='absolute inset-0 z-30'>
          {/* descending order */}
          <Image
            src={mix21_1.url}
            alt='{mix21_1.alt}'
            width={mix21_1.width}
            height={mix21_1.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '222px', left: '304px' }}
          />
          <Image
            src={mix21_2.url}
            alt='{mix21_2.alt}'
            width={mix21_2.width}
            height={mix21_2.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '351px', left: '236px' }}
          />
          <Image
            src={mix21_3.url}
            alt='{mix21_3.alt}'
            width={mix21_3.width}
            height={mix21_3.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '711px', left: '0' }}
          />
          <Image
            src={mix21_4.url}
            alt='{mix21_4.alt}'
            width={mix21_4.width}
            height={mix21_4.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '492px', left: '30px' }}
          />
        </div>
        {/* Background layer - static */}
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className='relative z-10 w-auto h-full pointer-events-none select-none'
        />
        {/* Liukanshan character */}
        <div
          className='absolute inset-0 z-50 pointer-events-none'
          style={{ top: '51%', left: '26%' }}
        >
          <Image
            src={liukanshanAsset.url}
            alt={liukanshanAsset.alt}
            width={liukanshanAsset.width}
            height={liukanshanAsset.height}
            className='object-contain pointer-events-none select-none'
          />
        </div>
        {/* Top layer with wiper mask effect using new middle image + vertical line gradient */}
        <div
          className='absolute inset-0 z-20 pointer-events-none'
          style={{
            maskImage: `url("${middleAsset.url}")`,
            WebkitMaskImage: `url("${middleAsset.url}")`,
            maskSize: 'auto 100%',
            maskRepeat: 'no-repeat',
            maskPosition: `${maskPosition}px center`,
            maskMode: 'alpha',
          }}
        >
          <Image
            src={topAsset.url}
            alt={topAsset.alt}
            width={topAsset.width / 2}
            height={topAsset.height}
            className='w-full h-full pointer-events-none select-none'
          />
        </div>
        {/* Range input - hidden but kept for animation control */}
        <input
          type='range'
          min='-300'
          max='300'
          value={maskPosition}
          onChange={handleRangeChange}
          className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 z-30'
          style={{ opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}
        />
        {/* Options */}
        <p
          className='absolute z-[70] text-xl cursor-pointer'
          style={{ top: '625px', left: '23px', pointerEvents: 'auto' }}
          onClick={() => handleSelect('A')}
          role='button'
          tabIndex={0}
        >
          <span
            style={{ display: 'inline-block', width: '90px', color: '#7D4617' }}
          >
            A. 寻着光探索未知
          </span>
        </p>
        <p
          className='absolute z-[70] text-xl cursor-pointer'
          style={{ top: '286px', left: '230px', pointerEvents: 'auto' }}
          onClick={() => handleSelect('B')}
          role='button'
          tabIndex={0}
        >
          <span
            style={{ display: 'inline-block', width: '84px', color: '#2F8C07' }}
          >
            B. 跟着图奔向目标
          </span>
        </p>
        {/* content **/}
        <div className='z-0'>
          <div
            className={`absolute z-20 text-center leading-relaxed`}
            style={{ fontSize: 24, top: '114px', left: '70px', right: '70px' }}
          >
            这一年，
            <br />
            你如何与世界过招？
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
