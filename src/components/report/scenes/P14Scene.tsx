'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
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

export default function P14Scene({ onNext, onPrevious, onNavigateToScene, sceneName }: PageProps) {
  const [maskPosition, setMaskPosition] = useState(460);
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskPosition(Number(e.target.value));
  };

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
    ? { scale: [1, 1.06, 1], opacity: 1 }
    : { scale: 1, opacity: 0 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 1.2,
          ease: 'easeInOut' as const,
        },
        opacity: {
          duration: 0.5,
          ease: 'easeInOut' as const,
        },
      }
    : {
        opacity: {
          duration: 0.5,
          ease: 'easeInOut' as const,
        },
      };
  const floatPulseB = isMaskAboveThreshold
    ? { scale: [1, 1.2, 1], opacity: 1 }
    : { scale: 1, opacity: 0 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: 'reverse' as const,
          duration: 1.2,
          ease: 'easeInOut' as const,
        },
        opacity: {
          duration: 0.5,
          ease: 'easeInOut' as const,
        },
      }
    : {
        opacity: {
          duration: 0.5,
          ease: 'easeInOut' as const,
        },
      };

  return (
    <BaseScene onNext={onNext} onPrevious={onPrevious} onNavigateToScene={onNavigateToScene} sceneName={sceneName}>
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
        {/* Range input displayed vertically on the right side */}
        <input
          type='range'
          min='0'
          max='760'
          value={maskPosition}
          onChange={handleRangeChange}
          className='absolute right-4 top-1/2 transform -translate-y-1/2 z-50'
          style={{
            pointerEvents: 'auto',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center',
            width: '60vh',
            height: 'auto',
          }}
        />
      </div>
    </BaseScene>
  );
}
