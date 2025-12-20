'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { submitQuizAnswer } from '@/api/report';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P9Scene({ onNext, onPrevious, onNavigateToScene, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();
  
  // Use motion value with spring physics for smooth, physics-based animation
  const maskPositionMotion = useMotionValue(-300);
  const maskPositionSpring = useSpring(maskPositionMotion, {
    stiffness: 50,
    damping: 15,
    mass: 1,
  });
  
  const [maskPosition, setMaskPosition] = useState(-300);

  // Sync motion value with state for maskPosition updates
  useEffect(() => {
    const unsubscribe = maskPositionSpring.on("change", (latest) => {
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

        const basePosition = -300;
        const shakeAmount = 200; // Shake amount
        
        // Use smooth sine wave oscillation for predictable, smooth motion
        const elapsed = (Date.now() - startTime) / 1000; // Time in seconds
        const frequency = 0.2; // Oscillation frequency (cycles per second) - lower = slower
        // Map sine wave from [-1, 1] to [0, shakeAmount] so it goes from basePosition to basePosition + shakeAmount
        const smoothOffset = (Math.sin(elapsed * frequency * Math.PI * 2) + 1) / 2 * shakeAmount;
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
    setUserChoice('p9', choice);
    // call API to record the choice
    try {
      await submitQuizAnswer({
        question_id: 2,
        answer: choice,
      });
    } catch (error) {
      console.error('Failed to submit quiz answer:', error);
      // Continue to next scene even if API call fails
    }
    onNext?.();
  };

  if (!assets) return null;

  const p9Assets = assets.report.p9;
  const bgAsset = p9Assets.bg;
  const pixelBgAsset = assets.report.bg;
  const blue1Asset = pixelBgAsset.blue1;
  const mix3Asset = pixelBgAsset.mix3;
  const topAsset = p9Assets.top;
  const middleAsset = p9Assets.middle;
  const liukanshanAsset = p9Assets.liukanshan;


  return (
    <BaseScene onNext={onNext} onPrevious={onPrevious} onNavigateToScene={onNavigateToScene} sceneName={sceneName}>
      <GlitchLayer className='z-[40]'>
        <Image
          src={blue1Asset.url}
          alt=''
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{
            top: '72px',
            left: '40px',
            transform: 'scale(0.8) rotate(180deg)',
          }}
        />
        <Image
          src={mix3Asset.url}
          alt={mix3Asset.alt}
          width={mix3Asset.width}
          height={mix3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{
            top: '359px',
            left: '0px',
            transform: 'rotate(180deg) scaleY(-1)',
          }}
        />
        <Image
          src={blue1Asset.url}
          alt=''
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{
            bottom: '144px',
            right: '0px',
            transform: 'rotate(180deg)',
          }}
        />
      </GlitchLayer>
      <div className='relative w-full h-full overflow-hidden'>
        <p
          className='absolute z-30 text-center text-xl w-full'
          style={{ top: '106px' }}
        >
          回望这一年，
          <br />
          哪一份收获更「真」？
        </p>
        <p
          className='absolute z-[70] text-center text-xl text-r-yellow cursor-pointer'
          style={{
            width: '188px',
            bottom: '146px',
            left: '22px',
            pointerEvents: 'auto',
          }}
          onClick={() => handleSelect('A')}
          role='button'
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', color: '#2AAE9D' }}>
            A.思考与哲理的启发
          </span>
        </p>
        <p
          className='absolute z-[70] text-center text-xl text-r-blue cursor-pointer'
          style={{
            width: '185px',
            bottom: '99px',
            right: '24px',
            pointerEvents: 'auto',
          }}
          onClick={() => handleSelect('B')}
          role='button'
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', color: '#F47246' }}>
            B.知识与经验的输入
          </span>
        </p>

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
          style={{ top: '49%', left: '26%' }}
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
          min='-375'
          max='0'
          value={maskPosition}
          onChange={handleRangeChange}
          className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 z-50'
          style={{ opacity: 0, pointerEvents: 'none', visibility: 'hidden' }}
        />
      </div>
    </BaseScene>
  );
}
