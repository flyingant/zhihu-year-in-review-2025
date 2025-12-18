'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { formatDateWithoutText } from '@/utils/common';
import FlipCounter from '@/components/ui/FlipCounter';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P6Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const green1Asset = bgAsset.green1;
  const mix1Asset = bgAsset.mix1;
  const mix2Asset = bgAsset.mix2;
  const p6GifAsset = assets.report.p6.gif;
  const booksAsset = assets.report.p6.books;

  // Map context data to component variables according to P6 spec
  const totalWords = reportData?.content_total_word_cnt ?? 0;
  const creationDays = reportData?.publish_total_day_cnt ?? 0;
  const mostProductiveMonth = reportData?.publish_max_month ?? null;
  const { month, day } = formatDateWithoutText(
    reportData?.publish_most_word_date ?? null
  );
  const dayWordCount = reportData?.publish_most_word_cnt ?? null;
  // Note: equivalentBook calculation is frontend logic based on totalWords

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={blue1Asset.url}
          alt={blue1Asset.alt}
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '20px', right: '36px' }}
        />
        <Image
          src={mix2Asset.url}
          alt={mix2Asset.alt}
          width={mix2Asset.width}
          height={mix2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', left: '0px' }}
        />
        <Image
          src={blue2Asset.url}
          alt={blue2Asset.alt}
          width={blue2Asset.width}
          height={blue2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '194px', right: '74px' }}
        />
        <Image
          src={green1Asset.url}
          alt={green1Asset.alt}
          width={green1Asset.width}
          height={green1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '0%', left: '0px' }}
        />
        <Image
          src={mix1Asset.url}
          alt={mix1Asset.alt}
          width={mix1Asset.width}
          height={mix1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '0%', right: '0px' }}
        />
      </GlitchLayer>

      <div style={{ paddingTop: '120px', fontSize: '14px' }}>
        <div
          style={{
            fontSize: '22px',
            marginBottom: '40px',
            paddingLeft: '34px',
          }}
        >
          真实的表达，写清了自己
        </div>

        {/* 总字数 */}
        <div
          hidden={!totalWords}
          style={{
            marginBottom: '10px',
            lineHeight: '32px',
            paddingLeft: '34px',
            paddingRight: '34px',
          }}
        >
          你在知乎写下了
          <span
            className={`text-r-pink`}
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '18px',
            }}
          >
            {totalWords}
          </span>
          个字
        </div>

        {/* 创作天数 */}
        <div
          style={{
            marginBottom: '30px',
            paddingLeft: '34px',
            paddingRight: '34px',
          }}
        >
          一句一行，都是你的
          <span
            className={`text-r-fern`}
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '18px',
            }}
          >
            2025.txt
          </span>
        </div>

        <div className='z-0 flex '>
          <div className='relative'>
            <Image
              src={booksAsset.url}
              alt={booksAsset.alt}
              width={booksAsset.width}
              height={booksAsset.height}
              className='object-contain pointer-events-none select-none z-1 relative'
              unoptimized
              style={{ left: '0px', marginTop: '96px' }}
            />
            <Image
              src={p6GifAsset.url}
              alt={p6GifAsset.alt}
              width={p6GifAsset.width}
              height={p6GifAsset.height}
              className='object-contain pointer-events-none select-none z-1 relative'
              unoptimized
              style={{ left: '51px', top: '0px', position: 'absolute' }}
            />
          </div>

          <div className='text-center' style={{ paddingTop: '20px' }}>
            <div>
              在
              <FlipCounter
                value={123}
                className={`text-r-blue`}
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  fontSize: '44px',
                }}
              />
              天里
            </div>
            <div style={{ paddingTop: '8px' }}>你都勇敢表达、留下印记</div>
          </div>
        </div>

        {/* 最高产月份 */}
        <div
          style={{
            paddingBottom: '8px',
            paddingTop: '60px',
            paddingLeft: '34px',
            paddingRight: '34px',
          }}
        >
          <div hidden={!mostProductiveMonth || creationDays < 5}>
            <div style={{ marginBottom: '6px' }}>
              <span
                className={`text-r-blue`}
                style={{ paddingRight: '4px', fontSize: '18px' }}
              >
                {mostProductiveMonth}
              </span>
              月是你的灵感高峰
            </div>
          </div>
          {/* 文思泉涌的一天 */}
          <div hidden={!dayWordCount || dayWordCount < 30}>
            <div style={{ marginBottom: '6px' }}>
              <span
                className={`text-r-yellow`}
                style={{ paddingRight: '5px', fontSize: '18px' }}
              >
                {month}
              </span>
              月
              <span
                className={`text-r-yellow`}
                style={{
                  paddingRight: '5px',
                  fontSize: '18px',
                  paddingLeft: '4px',
                }}
              >
                {day}
              </span>
              日，你写下了今年最多的
              <span
                className={`text-r-fern`}
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  fontSize: '18px',
                }}
              >
                {dayWordCount}
              </span>
              字
            </div>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
