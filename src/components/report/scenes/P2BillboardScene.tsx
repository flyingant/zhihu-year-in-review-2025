'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { formatDate, truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P2BillboardScene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { reportData } = useUserReportData();

  const [hasHit, setHasHit] = useState(false);

  useEffect(() => {
    // 400ms 对应 jump-hit 动画跳到最高点的时间 (0.8s 的一半)
    const hitTimer = setTimeout(() => {
      setHasHit(true);
    }, 400);

    return () => clearTimeout(hitTimer);
  }, []);

  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const green1Asset = bgAsset.green1;
  const mix1Asset = bgAsset.mix1;
  const mix2Asset = bgAsset.mix2;

  const p2Assets = assets.report.p2;
  const liukanshanAsset = p2Assets.liukanshan;
  const blueBallAsset = p2Assets.blueBall;
  const yellowBallAsset = p2Assets.yellowBall;

  const billboardCount = reportData?.billboard_question_cnt ?? 0;
  const billboardQuestionDate =
    formatDate((reportData?.billboard_question_date ?? '') as string | null) ||
    '05月06日';
  const billboardQuestionTitle = truncateText(
    (reportData?.billboard_question_title ?? '') as string | null,
    28
  );

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 标题右侧蓝色小块 */}
        {blue1Asset && (
          <Image
            src={blue1Asset.url}
            alt={blue1Asset.alt}
            width={blue1Asset.width}
            height={blue1Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '20px', right: '36px' }}
          />
        )}
        {/* 标题左侧粉色/绿色小块 */}
        {mix2Asset && (
          <Image
            src={mix2Asset.url}
            alt={mix2Asset.alt}
            width={mix2Asset.width}
            height={mix2Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '152px', left: '0px' }}
          />
        )}
        {/* 中间左侧蓝色马赛克 */}
        {blue2Asset && (
          <Image
            src={blue2Asset.url}
            alt={blue2Asset.alt}
            width={blue2Asset.width}
            height={blue2Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ bottom: '231px', left: '26px' }}
          />
        )}
        {/* 左下角绿色故障树 */}
        {green1Asset && (
          <Image
            src={green1Asset.url}
            alt={green1Asset.alt}
            width={green1Asset.width}
            height={green1Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ bottom: '0%', left: '0px' }}
          />
        )}
        {/* 右下角红绿长条 */}
        {mix1Asset && (
          <Image
            src={mix1Asset.url}
            alt={mix1Asset.alt}
            width={mix1Asset.width}
            height={mix1Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ bottom: '0%', right: '0px' }}
          />
        )}
      </GlitchLayer>
      <div className='z-10'>
        <div
          style={{
            paddingLeft: '34px',
            paddingRight: '34px',
            paddingTop: '120px',
          }}
        >
          <div style={{ fontSize: '22px' }}>这一年，你依旧好奇</div>
          <div
            style={{ paddingTop: '60px', paddingBottom: '2px' }}
            hidden={!billboardCount}
          >
            <span className='text-r-pink' style={{ fontSize: '18px' }}>
              {billboardCount}
            </span>{' '}
            个提问登上了热榜
          </div>
          <div
            className='text-lg mt-5'
            hidden={!billboardQuestionDate || !billboardQuestionTitle}
          >
            <span className='text-r-green' style={{ fontSize: '18px' }}>
              {billboardQuestionDate}
            </span>
            ，
            <span className='text-r-fern' style={{ fontSize: '20px' }}>
              {billboardQuestionTitle}
            </span>{' '}
            在热榜被更多人看见
          </div>
        </div>
        <div
          className='absolute pointer-events-none select-none z-10'
          style={{
            bottom: hasHit ? '204px' : '222px',
            right: hasHit ? '19px' : '74px',
            width: hasHit ? yellowBallAsset?.width : blueBallAsset?.width,
            height: hasHit ? yellowBallAsset?.height : blueBallAsset?.height,
          }}
        >
          {/* 1. 蓝色球 (没顶到时显示，顶到后隐藏) */}
          <div
            className={`absolute inset-0 transition-opacity duration-100 ${
              hasHit ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src={blueBallAsset.url}
              alt='Blue Ball'
              width={blueBallAsset.width}
              height={blueBallAsset.height}
              className='object-contain'
            />
          </div>

          {/* 2. 黄色球 (顶到后显示，并播放 bump 动画) */}
          <div
            className={`absolute inset-0 ${
              hasHit ? 'opacity-100 animate-ball-bump' : 'opacity-0'
            }`}
          >
            <Image
              src={yellowBallAsset.url}
              alt='Yellow Ball'
              width={yellowBallAsset.width}
              height={yellowBallAsset.height}
              className='object-contain'
            />
          </div>
        </div>

        {/* === 刘看山 (使用 Tailwind 配置的 animate-jump-hit) === */}
        {liukanshanAsset && (
          <Image
            src={liukanshanAsset.url}
            alt='Liukanshan'
            width={liukanshanAsset.width}
            height={liukanshanAsset.height}
            className='object-contain absolute pointer-events-none select-none z-1 animate-jump-hit'
            style={{ bottom: '40px', right: '55px' }}
          />
        )}
      </div>
    </BaseScene>
  );
}
