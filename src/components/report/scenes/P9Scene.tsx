'use client';

import { useEffect, useState } from 'react';
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
        const shakeAmount = 75; // Offset: how much to shake from base position
        
        // Use smooth sine wave oscillation for predictable, smooth motion
        const elapsed = (Date.now() - startTime) / 1000; // Time in seconds
        const frequency = 0.2; // Oscillation frequency (cycles per second) - lower = slower
        const smoothOffset = Math.sin(elapsed * frequency * Math.PI * 2) * shakeAmount;
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

  if (!assets) return null;

  const p9Assets = assets.report.p9;
  const bgAsset = p9Assets.bg;
  const pixelBgAsset = assets.report.bg;
  const blue1Asset = pixelBgAsset.blue1;
  const mix3Asset = pixelBgAsset.mix3;
  const topAsset = p9Assets.top;
  const middleAsset = p9Assets.middle;
  const liukanshanAsset = p9Assets.liukanshan;

  const isMaskPastThreshold = maskPosition < -300;
  const isMaskAboveThreshold = maskPosition > -300;
 const floatPulse = isMaskPastThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 1.2,
          ease: "easeInOut" as const,
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
          repeatType: "reverse" as const,
          duration: 1.2,
          ease: "easeInOut" as const,
        },
      }
    : {};
  
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
          style={{ top: '73px', fontSize: 26, lineHeight: '40px' }}
        >
          回望这一年，
          <br />
          哪一份收获更「真」？
        </p>
        <motion.div
          className='absolute z-[70] text-center text-xl text-r-yellow cursor-pointer'
          style={{
            width: '224px',
            left: 0,
            right: 0,
            top: 229,
            margin: '0 auto',
            pointerEvents: 'auto',
          }}
          animate={floatPulseB}
          transition={floatPulseTransition}
          onClick={() => handleSelect('A')}
          role='button'
          tabIndex={0}
        >
          <Image src={p9Assets.optionA.url} alt={p9Assets.optionA.alt} width={p9Assets.optionA.width} height={p9Assets.optionA.height} style={{ width: 224, height: 36}} />
        </motion.div>
        <motion.div
          className='absolute z-[70] text-center text-xl text-r-blue cursor-pointer'
          style={{
            width: '224px',
            bottom: '99px',
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
          <Image src={p9Assets.optionB.url} alt={p9Assets.optionB.alt} width={p9Assets.optionB.width} height={p9Assets.optionB.height} style={{ width: 224, height: 36}} />
        </motion.div>

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
            maskPosition: `${maskPosition + 110}px center`,
            maskMode: 'alpha',
          }}
        >
          <Image
            src={topAsset.url}
            alt={topAsset.alt}
            width={topAsset.width /2}
            height={topAsset.height}
            className='w-full h-full pointer-events-none select-none'
          />
        </div>
      </div>
    </BaseScene>
  );
}
