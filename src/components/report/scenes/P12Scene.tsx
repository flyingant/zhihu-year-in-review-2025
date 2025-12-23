'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { formatDateWithoutText } from '@/utils/common';
import TimeDonutChart from '@/components/report/effects/TimeDonutChart';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P12Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  // const mix8Asset = bgAsset.mix8; // Not used in JSX, commented out
  const liukanshanAsset = assets.report.p12.liukanshan;
  const p12GifAsset = assets.report.p12.gif;
  const sunAsset = assets.report.p12.sun;
  const moonAsset = assets.report.p12.moon;

  // Map context data to component variables according to P12 spec (消费-峰值数据)
  const hours = {
    earlyMorning: Number(reportData?.early_morning_hours || 0),
    morning: Number(reportData?.morning_hours || 0),
    forenoon: Number(reportData?.forenoon_hours || 0),
    noon: Number(reportData?.noon_hours || 0),
    afternoon: Number(reportData?.afternoon_hours || 0),
    evening: Number(reportData?.evening_hours || 0),
    night: Number(reportData?.night_hours || 0),
  };

  const { month, day } =
    formatDateWithoutText(
      reportData?.zhihu_browse_last_date as string | undefined
    ) ?? null;
  const browseLastTime =
    (reportData?.zhihu_browse_last_date_hour as string | undefined) ?? null;
  const browseLastCategory =
    (reportData?.zhihu_browse_last_content_domain as string | undefined) ??
    null;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      <GlitchLayer className='z-0'>
        {/* 顺序从上到下 */}
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '49px', left: '27px' }}
        />
        <Image
          src={mix7Asset.url}
          alt={mix7Asset.alt}
          width={mix7Asset.width}
          height={mix7Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '30px', right: '0px' }}
        />
        <Image
          src={mix9Asset.url}
          alt={mix9Asset.alt}
          width={mix9Asset.width}
          height={mix9Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '0px', right: '0px' }}
        />
      </GlitchLayer>

      {/* 不同时段阅读足迹 */}
      <div
        style={{
          paddingTop: '100px',
          paddingBottom: '10px',
          paddingLeft: '34px',
          paddingRight: '34px',
          fontSize: '16px',
        }}
      >
        <div style={{ fontSize: '22px' }}>
          <div>当下的专注，便是最真的你 </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          今年，你在不同时段留下自己的阅读足迹
        </div>
      </div>

      <div
        className='relative w-full flex flex-col items-center justify-center'
        style={{ marginTop: '80px' }}
      >
        {/* 1. 轨道层 */}
        <div
          className='absolute top-1/2 left-1/2 pointer-events-none animate-orbit rounded-full'
          style={{ zIndex: 0, width: '480px', height: '480px' }}
        >
          {/* 太阳 */}
          <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='animate-counter-spin'>
              <Image
                src={sunAsset.url}
                alt='sun'
                width={sunAsset.width}
                height={sunAsset.height}
                className='object-contain'
              />
            </div>
          </div>

          {/* 月亮 */}
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'>
            <div className='animate-counter-spin'>
              <Image
                src={moonAsset.url}
                alt='moon'
                width={moonAsset.width}
                height={moonAsset.height}
                className='object-contain'
              />
            </div>
          </div>
        </div>

        {/* 2. 图表层 */}
        <div
          className='relative w-full flex items-center justify-center'
          style={{ height: '300px', zIndex: 1 }}
        >
          <TimeDonutChart data={hours} />
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <Image
              src={p12GifAsset.url}
              alt={p12GifAsset.alt}
              width={liukanshanAsset.width}
              height={liukanshanAsset.height}
              className='object-contain'
              style={{ marginBottom: '10px' }}
              unoptimized
              priority
            />
          </div>
        </div>

        {/* 3. 文字层 */}
        <div style={{ paddingTop: '50px' }}></div>
        <div
          className='relative z-10 text-center text-sm font-medium leading-relaxed'
          hidden={!browseLastCategory}
        >
          <p className='flex items-center justify-center flex-wrap gap-1'>
            <span className='text-r-yellow' style={{ fontSize: '18px' }}>
              {month}
            </span>
            月
            <span className='text-r-yellow' style={{ fontSize: '18px' }}>
              {day}
            </span>
            日
            <span className='text-r-yellow' style={{ fontSize: '18px' }}>
              {browseLastTime}
            </span>
            <span>点，你仍在看</span>
            <span className='text-r-fern' style={{ fontSize: '18px' }}>
              {browseLastCategory}
            </span>
            <span>领域的内容</span>
          </p>
        </div>
      </div>
    </BaseScene>
  );
}
