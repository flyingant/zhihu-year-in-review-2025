'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import { colorClass, typographyClass } from '@/hooks/useSceneTheme';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P8Scene({ onNext, onPrevious, onNavigateToScene, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const p8GifAsset = assets.report.p8.gif;
  const sparkleAsset = assets.report.p8.sparkle;
  const shipAsset = assets.report.p8.ship;

  // Map context data to component variables according to P8 spec
  const zhiTrendRankCount = reportData?.zhishi_cnt ?? null;
  const influenceRankCount = reportData?.biz_list_num ?? null;
  const bestAnswerTopic = reportData?.best_answer_topic ?? [];
  const isNavigator = reportData?.is_navigator ?? 0;
  const navigatorContentCount =
    reportData?.navigator_upvote_content_cnt ?? null;

  return (
    <BaseScene onNext={onNext} onPrevious={onPrevious} onNavigateToScene={onNavigateToScene} sceneName={sceneName}>
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
          src={mix5Asset.url}
          alt={mix5Asset.alt}
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '20px', right: '74px' }}
        />
      </GlitchLayer>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '120px',
        }}
      >
        <div
          style={{ lineHeight: '1.4', marginBottom: '68px', fontSize: '22px' }}
        >
          这一路，作品为你点亮星光
        </div>

        <div hidden={!zhiTrendRankCount} style={{ paddingBottom: '18px' }}>
          你登上了
          <span
            className='text-r-pink'
            style={{
              fontSize: '18px',
              paddingRight: '4px',
              paddingLeft: '4px',
            }}
          >
            {zhiTrendRankCount}
          </span>
          次知势榜
        </div>

        <div hidden={!influenceRankCount}>
          上榜知乎答主商业影响力榜
          <span
            className='text-r-purple'
            style={{
              fontSize: '18px',
              paddingRight: '4px',
              paddingLeft: '4px',
            }}
          >
            {influenceRankCount}
          </span>
          次
        </div>

        <div style={{ lineHeight: '40px' }} hidden={!bestAnswerTopic.length}>
          在
          {bestAnswerTopic.map((topic, index) => (
            <span key={index}>
              <span className={`text-r-blue`} style={{ fontSize: '18px' }}>
                {topic}
                {index !== bestAnswerTopic.length - 1 && '，'}
              </span>
            </span>
          ))}
          话题下成为优秀答主
        </div>

        {/* 奖杯和刘看山区域 */}
        <div style={{ position: 'relative', paddingTop: '50px' }}>
          <Image
            priority
            src={sparkleAsset.url}
            alt={sparkleAsset.alt}
            width={sparkleAsset.width}
            height={sparkleAsset.height}
            className='opacity-0 animate-pop-sparkle object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '10px', left: '90px' }}
          />
          <Image
            priority
            src={p8GifAsset.url}
            alt={p8GifAsset.alt}
            width={p8GifAsset.width}
            height={p8GifAsset.height}
            className='object-contain relative pointer-events-none select-none z-10'
            unoptimized
            style={{ top: '0px', left: '60px' }}
          />
        </div>

        {/* 航海家区域 - 从右侧滑入动画 */}
        <div hidden={isNavigator === 0} style={{ marginTop: '-30px' }}>
          <div
            className='opacity-0 animate-slide-in-right'
            style={{
              animationDelay: '0.5s',
              display: 'flex',
            }}
          >
            <div style={{ lineHeight: '26px', marginTop: '8px' }}>
              <div>
                你成为了
                <span
                  className='text-r-blue'
                  style={{ paddingLeft: '4px', paddingRight: '4px' }}
                >
                  航海家
                </span>
              </div>

              <div hidden={!navigatorContentCount}>
                用航海家赞同发现和助力了
                <span
                  className='text-r-green'
                  style={{
                    fontSize: '18px',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }}
                >
                  {navigatorContentCount}
                </span>
                篇好内容
                <span
                  className='inline-block align-middle ml-1'
                  style={{ width: shipAsset.width, height: shipAsset.height }}
                >
                  <Image
                    src={shipAsset.url}
                    alt={shipAsset.alt}
                    width={shipAsset.width}
                    height={shipAsset.height}
                    className='object-contain pointer-events-none select-none'
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
