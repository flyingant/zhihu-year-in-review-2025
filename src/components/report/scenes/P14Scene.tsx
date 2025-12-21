'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { submitQuizAnswer } from '@/api/report';

interface PageProps {
  onNext?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P14Scene({
  onNext,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();

  // Use motion value with spring physics for smooth, physics-based animation (vertical)
  const maskPositionMotion = useMotionValue(200);
  const maskPositionSpring = useSpring(maskPositionMotion, {
    stiffness: 50,
    damping: 15,
    mass: 1,
  });

  const [maskPosition, setMaskPosition] = useState(200);

  // Sync motion value with state for maskPosition updates
  useEffect(() => {
    const unsubscribe = maskPositionSpring.on('change', (latest) => {
      setMaskPosition(Math.round(latest));
    });
    return unsubscribe;
  }, [maskPositionSpring]);

  // Create smooth physics-based shake animation (vertical)
  useEffect(() => {
    let isAnimating = true;
    const startTime = Date.now();

    const createSmoothShakeAnimation = () => {
      const animate = () => {
        if (!isAnimating) return;

        const basePosition = 200; // Vertical base position
        const shakeAmount = 400; // Shake amount

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
        scale: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 1.2,
          ease: 'easeInOut' as const,
        },
      }
    : {};
  const floatPulseB = isMaskAboveThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 1.2,
          ease: 'easeInOut' as const,
        },
      }
    : {};
  return (
    <BaseScene
      onNext={onNext}
      disableSwipe={true}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      <div
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
          style={{ top: '73px', fontSize: 26, lineHeight: '40px' }}
        >
          当你赞同时
          <br />
          你在回应什么？
        </p>
        <motion.p
          className='absolute z-[70] text-center text-xl text-r-yellow cursor-pointer'
          style={{
            width: '224px',
            top: '198px',
            left: 0,
            right: 0,
            margin: '0 auto',
            pointerEvents: 'auto',
          }}
          animate={floatPulseB}
          transition={floatPulseTransition}
          onClick={() => handleSelect('A')}
          role='button'
          tabIndex={0}
        >
          <Image
            src={p14Assets.optionA.url}
            alt={p14Assets.optionA.alt}
            width={p14Assets.optionA.width}
            height={p14Assets.optionA.height}
            style={{ width: 224, height: 36 }}
          />
        </motion.p>
        <motion.p
          className='absolute z-[70] text-center text-xl text-r-blue cursor-pointer'
          style={{
            width: '224px',
            bottom: '150px',
            left: 0,
            right: 0,
            margin: '0 auto',
            pointerEvents: 'auto',
          }}
          animate={floatPulse}
          transition={floatPulseTransitionB}
          onClick={() => handleSelect('B')}
          role='button'
          tabIndex={0}
        >
          <Image
            src={p14Assets.optionB.url}
            alt={p14Assets.optionB.alt}
            width={p14Assets.optionB.width}
            height={p14Assets.optionB.height}
            style={{ width: 224, height: 36 }}
          />
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
      </div>
    </BaseScene>
  );
}
