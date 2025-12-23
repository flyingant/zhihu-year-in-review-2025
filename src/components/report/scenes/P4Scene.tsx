'use client';

import { useRef, useEffect } from 'react';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useAudio } from '@/context/audio-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { truncateText } from '@/utils/common';
import PixelFireworks from '@/components/report/effects/PixelFireworks';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P4Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  const { isPlaying: isBgMusicPlaying } = useAudio();

  const audioRef = useRef<HTMLAudioElement>(null);

  // Play audio twice during the jump-steps animation
  // Only play if background music is playing
  useEffect(() => {
    const playJumpSound = () => {
      // Only play sound effect if background music is playing
      if (audioRef.current && isBgMusicPlaying) {
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play().catch((error) => {
          console.error('Error playing jumpUp audio:', error);
        });
      }
    };

    // First jump at 20% of 2s = 400ms
    const firstJumpTimer = setTimeout(() => {
      playJumpSound();
    }, 400);

    // Second jump at 70% of 2s = 1400ms
    const secondJumpTimer = setTimeout(() => {
      playJumpSound();
    }, 1400);

    return () => {
      clearTimeout(firstJumpTimer);
      clearTimeout(secondJumpTimer);
    };
  }, [isBgMusicPlaying]);

  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const mix3Asset = bgAsset.mix3;
  const mix4Asset = bgAsset.mix4;
  const mix5Asset = bgAsset.mix5;

  const liukanshanAsset = assets.report.p2.liukanshan;
  const jiangtaiAsset = assets.report.p3.jiangtai;
  const caidaiAsset = assets.report.p4.caidai;
  const jumpUpAudioUrl = assets.report.audio.jumpUp?.url;

  const toStringOrFallback = (value: unknown, fallback: string) =>
    typeof value === 'string' && value.trim() ? value : fallback;

  const toNumberOrFallback = (value: unknown, fallback: string) =>
    typeof value === 'number' ? value : fallback;

  // Map context data to component variables according to P4 spec
  const questionTitle = truncateText(
    (reportData?.answer_most_upvote_question_title ?? '') as string,
    28
  );
  const upvoteCount = toNumberOrFallback(
    reportData?.answer_most_upvote_cnt,
    ''
  );
  const thousandUpvoteAnswers = toNumberOrFallback(
    reportData?.answer_1k_upvote_cnt,
    ''
  );

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      {/* Hidden audio element for jump sound */}
      {jumpUpAudioUrl && <audio ref={audioRef} src={jumpUpAudioUrl} />}
      <PixelFireworks delay={2000} minStartY={-100} maxStartY={400} />
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={blue2Asset.url}
          alt={blue2Asset.alt}
          width={blue2Asset.width}
          height={blue2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '45px', left: '-8px' }}
        />
        <Image
          src={mix3Asset.url}
          alt={mix3Asset.alt}
          width={mix3Asset.width}
          height={mix3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', right: '0px' }}
        />
        <Image
          src={mix4Asset.url}
          alt={mix4Asset.alt}
          width={mix4Asset.width}
          height={mix4Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '480px', left: '0px' }}
        />
        <Image
          src={blue1Asset.url}
          alt={blue1Asset.alt}
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '267px', right: '150px' }}
        />
        <Image
          src={mix5Asset.url}
          alt={mix5Asset.alt}
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '22px', right: '88px' }}
        />
      </GlitchLayer>

      <div className='z-0'>
        <Image
          priority
          src={liukanshanAsset.url}
          alt={liukanshanAsset.alt}
          width={liukanshanAsset.width}
          height={liukanshanAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1 animate-jump-steps'
          style={{ bottom: '48px', left: '-20px' }}
        />
        <Image
          priority
          src={jiangtaiAsset.url}
          alt={jiangtaiAsset.alt}
          width={jiangtaiAsset.width}
          height={jiangtaiAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '48px', left: '27px' }}
        />
      </div>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '100px',
          fontSize: '16px',
        }}
      >
        <div style={{ fontSize: '22px' }}>你的答案，让混沌变得清晰</div>
        <div
          className=''
          style={{ paddingTop: '46px', paddingBottom: '8px' }}
          hidden={questionTitle === '' || +upvoteCount <= 50}
        >
          <div style={{ paddingBottom: '2px' }}>
            你在
            <span
              className={`text-r-pink`}
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                fontSize: '18px',
                lineHeight: '32px',
              }}
            >
              {questionTitle}
            </span>
            问题下的回答
          </div>
          <div hidden={upvoteCount === 0}>
            被
            <span
              className={`text-r-fern`}
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                fontSize: '24px',
              }}
            >
              {upvoteCount}
            </span>
            次赞同点亮
            <br />
            <span>那是一次真实地被看见</span>
          </div>
        </div>

        <div
          style={{ paddingTop: '5px', paddingBottom: '20px' }}
          hidden={thousandUpvoteAnswers === 0}
        >
          这一年，你还迎来了
          <span
            className={`text-r-purple`}
            style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              fontSize: '24px',
            }}
          >
            {thousandUpvoteAnswers}
          </span>
          条千赞时刻
        </div>
      </div>
    </BaseScene>
  );
}
