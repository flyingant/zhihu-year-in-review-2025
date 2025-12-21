'use client';

import { useRef, useState, useEffect } from 'react';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { useAssets } from '@/context/assets-context';
import { useAudio } from '@/context/audio-context';
import Image from 'next/image';
import { truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  sceneName?: string;
}

export default function P25Scene({ onNext, onPrevious, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  const { isPlaying: isBgMusicPlaying } = useAudio();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Try to play audio when component mounts, but only if background music is playing
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && !audioPlayed && isBgMusicPlaying) {
        try {
          await audioRef.current.play();
          setAudioPlayed(true);
        } catch {
          // Autoplay was prevented, will play on user interaction
          console.log('Autoplay prevented, waiting for user interaction');
        }
      }
    };

    playAudio();
  }, [audioPlayed, isBgMusicPlaying]);

  // Handle click to play audio if autoplay was blocked, but only if background music is playing
  const handleSceneClick = () => {
    if (audioRef.current && !audioPlayed && isBgMusicPlaying) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch((error) => {
        console.error('Error playing flipBook audio:', error);
      });
      setAudioPlayed(true);
    }
  };

  if (!assets) return null;

  const { liukanshan, top, left, middle, right, gif } = assets.report.p25;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;
  const flipBookAudioUrl = assets.report.audio.flipBook?.url;

  // Map context data to component variables according to P25 spec (特殊-故事会员/读者)
  const paidContentCount = reportData?.paid_content_cnt ?? null;
  const totalWordCount = reportData?.total_word_cnt ?? null;
  const labelName1 = reportData?.label_name_top1 ?? null;
  const labelName2 = reportData?.label_name_top2 ?? null;
  const labelName3 = reportData?.label_name_top3 ?? null;
  const mostFavoriteAuthorName = reportData?.most_favorite_author_name ?? null;
  const mostFavoriteAuthorNum = reportData?.most_favorite_author_num ?? null;

  return (
    <BaseScene
      defaultLogo={false}
      onNext={onNext}
      onPrevious={onPrevious}
      sceneName={sceneName}
    >
      {/* Hidden audio element for flipBook sound */}
      {flipBookAudioUrl && <audio ref={audioRef} src={flipBookAudioUrl} />}

      {/* Clickable overlay to trigger audio if autoplay is blocked */}
      <div
        onClick={handleSceneClick}
        className='absolute inset-0 z-1'
        style={{ pointerEvents: audioPlayed ? 'none' : 'auto' }}
      />
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt='{mix22_1.alt}'
          width={mix22_1.width}
          height={mix22_1.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '344px', left: '0' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '278px', left: '308px' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '605px', left: '83px' }}
        />
        <Image
          src={mix22_4.url}
          alt='{mix22_4.alt}'
          width={mix22_4.width}
          height={mix22_4.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '739px', right: '0' }}
        />
      </GlitchLayer>
      {/* images */}
      <div className='z-0'>
        <Image
          src={top.url}
          alt='{top.alt}'
          width={top.width}
          height={top.height}
        />
        <Image
          src={liukanshan.url}
          alt='{liukanshan.alt}'
          width={liukanshan.width}
          height={liukanshan.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '295px', left: '0', right: '0' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.url}
          alt={gif.alt}
          width={gif.width / 2}
          height={gif.height / 2}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '415px', left: '100px', right: '0' }}
        />
        <Image
          src={left.url}
          alt='{left.alt}'
          width={left.width}
          height={left.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '412px', left: '80px', right: '0' }}
        />
        <Image
          src={middle.url}
          alt='{middle.alt}'
          width={middle.width}
          height={middle.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '380px', left: '180px', right: '0' }}
        />
        <Image
          src={right.url}
          alt='{right.alt}'
          width={right.width}
          height={right.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '422px', left: '281px', right: '0' }}
        />
      </div>
      <div className='z-0'>
        <div
          className='absolute pb-[30px]'
          style={{ top: '185px', left: '40px', right: '0' }}
        >
          {!!paidContentCount && !!totalWordCount && (
            <div className='mb-[10px]'>
              2025年，作为尊贵的盐选会员，
              <br />
              你解锁了
              <span
                className={`text-r-pink`}
                style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: 24,
                }}
              >
                {String(paidContentCount ?? 'paid_content_cnt')}
              </span>
              篇盐言故事，共
              <span
                className={`text-r-purple`}
                style={{
                  fontSize: 16,
                  paddingLeft: '6px',
                  paddingRight: '6px',
                }}
              >
                {String(totalWordCount ?? 'total_word_cnt')}
              </span>
              字
            </div>
          )}
        </div>

        {/* Top Books */}
        <div className='z-0' style={{ fontSize: 16 }}>
          <div
            style={{
              position: 'absolute',
              top: '315px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            hidden={!labelName1 || !labelName2 || !labelName3}
          >
            最打动你的故事元素是
          </div>
          {!!labelName1 && (
            <div
              className='absolute'
              style={{ fontSize: 17, top: '353px', left: '146px' }}
            >
              <span
                className={`text-r-green`}
                style={{ paddingLeft: '6px', paddingRight: '6px' }}
              >
                「{truncateText(String(labelName1 ?? 'label_name_top1'), 5)} 」
              </span>
            </div>
          )}
          {!!labelName2 && (
            <div
              className='absolute'
              style={{ fontSize: 17, top: '395px', left: '45px' }}
            >
              <span
                className={`text-r-blue`}
                style={{ paddingLeft: '6px', paddingRight: '6px' }}
              >
                「{truncateText(String(labelName2 ?? 'label_name_top2'), 5)} 」
              </span>
            </div>
          )}
          {!!labelName3 && (
            <div
              className='absolute'
              style={{ fontSize: 17, top: '395px', left: '247px' }}
            >
              <span
                className={`text-r-green`}
                style={{ paddingLeft: '6px', paddingRight: '6px' }}
              >
                「{truncateText(String(labelName3 ?? 'label_name_top3'), 5)} 」
              </span>
            </div>
          )}
        </div>

        <div
          className='absolute text-start'
          style={{
            fontSize: '16px',
            top: '657px',
            left: '40px',
            right: '40px',
          }}
        >
          {!!mostFavoriteAuthorName && (
            <div className='mb-[10px]'>
              你阅读最多的作者是
              <span
                className='text-r-fern'
                style={{ paddingLeft: '6px', paddingRight: '6px' }}
              >
                @{String(mostFavoriteAuthorName ?? 'most_favorite_author_name')}
              </span>
              <br />
              TA的
              <span
                className='text-r-yellow'
                style={{
                  fontSize: '18px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                }}
              >
                {String(mostFavoriteAuthorNum ?? 'most_favorite_author_num')}
              </span>
              篇故事，陪你度过了不少时光
            </div>
          )}
        </div>
      </div>
    </BaseScene>
  );
}
