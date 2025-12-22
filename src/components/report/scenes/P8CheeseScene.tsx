'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import PixelFireworks from '@/components/report/effects/PixelFireworks';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P8CheeseScene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const p8GifAsset = assets.report.p8.gif;
  const sparkleAsset = assets.report.p8.sparkle; 

  const cheeseAwards = (reportData?.cheese_award_list || '') as string;
  const studentName = (reportData?.cheese_student_name || '') as string;
  const courseCount = (reportData?.course_count || '无字段') as string;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      <PixelFireworks delay={1000} minStartY={-100} maxStartY={400} />
      <GlitchLayer>
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
          fontSize: '16px',
        }}
      >
        {!!cheeseAwards && (
          <div>
            <div
              style={{
                lineHeight: '1.4',
                marginBottom: '60px',
                fontSize: '22px',
              }}
            >
              这一路，作品为你点亮星光
            </div>
            <div hidden={!cheeseAwards}>
              <div style={{ paddingBottom: '8px' }}>
                <span
                  className='text-r-yellow font-bold'
                  style={{ fontSize: '18px' }}
                >
                  {cheeseAwards}
                </span>
              </div>

              <div style={{ paddingBottom: '80px', fontSize: '14px' }}>
                从洞察到价值，每一份内容都站在了更高的舞台
              </div>
            </div>
          </div>
        )}
        {/* 
            ===========================================
            奖杯区域 + 撒花特效 
            ===========================================
        */}
        <div
          className='absolute pointer-events-none select-none z-10'
          style={{
            bottom: '138px',
            left: '0', 
            right: '66px',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div className='relative'>
            <Image
              priority
              src={sparkleAsset.url}
              alt={sparkleAsset.alt}
              width={sparkleAsset.width}
              height={sparkleAsset.height}
              className='opacity-0 animate-pop-sparkle object-contain absolute pointer-events-none select-none z-20'
              style={{ top: '-50px', right: '-20px' }}
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
         
        </div>
        {!!studentName && (
          <div
            className='opacity-0 animate-slide-in-right absolute'
            style={{
              animationDelay: '0.5s',
              bottom: '85px',
              left: '34px',
              right: '34px',
              zIndex: 0
            }}
          >
            <div style={{ marginBottom: '8px' }} hidden={!courseCount}>
              你完成「芝士商学院」
              <span className='text-r-pink mx-1' style={{ fontSize: '18px' }}>
                2
              </span>
              期课程
            </div>

            <div hidden={!studentName}>
              并以
              <span
                className='text-r-green'
                style={{ fontSize: '16px', padding: '0 6px' }}
              >
                {studentName}
              </span>
              学员的身份，为成长写下注脚
            </div>
          </div>
        )}
      </div>
    </BaseScene>
  );
}
