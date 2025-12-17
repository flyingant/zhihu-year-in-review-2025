'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { formatDateWithoutText, truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P13Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const mix8Asset = bgAsset.mix8;
  const liukanshanAsset = assets.report.p13.liukanshan;

  // Map context data to component variables according to P13 spec
  // Note: P13 spec details to be confirmed, using placeholder structure
  const zhihuBrowseMostDate =
    (reportData?.zhihu_browse_most_date as string | undefined) ?? '';
  const { month, day } = formatDateWithoutText(zhihuBrowseMostDate);
  const zhihuBrowseMostDateDuration =
    (reportData?.zhihu_browse_most_date_duration as number | undefined) ?? 0;
  const consumeMostAnswerTitle =
    (reportData?.consume_most_answer_title as string | undefined) ?? '';
  const consumeMostAnswerPvCnt =
    (reportData?.consume_most_answer_pv_cnt as number | undefined) ?? 0;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
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
          src={mix8Asset.url}
          alt={mix8Asset.alt}
          width={mix8Asset.width}
          height={mix8Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '406px', left: '0px' }}
        />
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '90px', right: '35px' }}
        />
        <Image
          src={mix9Asset.url}
          alt={mix9Asset.alt}
          width={mix9Asset.width}
          height={mix9Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '0px', left: '-50px' }}
        />
      </GlitchLayer>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '120px',
          fontSize: '14px',
        }}
      >
        <div style={{ fontSize: '20px' }}>
          <div>一时的忘我，是真知赠予的心流</div>
        </div>

        <div
          style={{ paddingBottom: '10px', paddingTop: '30px' }}
          hidden={
            !zhihuBrowseMostDate ||
            !zhihuBrowseMostDateDuration ||
            zhihuBrowseMostDateDuration < 5
          }
        >
          <div
            style={{ marginBottom: '6px' }}
            hidden={
              !zhihuBrowseMostDate ||
              !zhihuBrowseMostDateDuration ||
              zhihuBrowseMostDateDuration < 5
            }
          >
            <span className='text-r-yellow' style={{ fontSize: '18px' }}>
              {month}
            </span>{' '}
            月
            <span
              className='text-r-yellow'
              style={{ fontSize: '18px', paddingLeft: '2px' }}
            >
              {' '}
              {day}
            </span>{' '}
            日 ，你在知乎停留了最长的
            <span
              className='text-r-fern'
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                fontSize: '18px',
              }}
            >
              {zhihuBrowseMostDateDuration}
            </span>
            分钟
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <Image
            src={liukanshanAsset.url}
            alt={liukanshanAsset.alt}
            width={liukanshanAsset.width}
            height={liukanshanAsset.height}
          />
        </div>

        <div
          style={{ paddingTop: '20px', paddingBottom: '20px' }}
          hidden={
            !consumeMostAnswerTitle ||
            !consumeMostAnswerPvCnt ||
            consumeMostAnswerPvCnt < 3
          }
        >
          <div>
            <span
              className='text-r-fern'
              style={{
                fontSize: '18px',
                marginLeft: '4px',
                marginRight: '4px',
              }}
            >
              {truncateText(consumeMostAnswerTitle)}
            </span>
            <div style={{ paddingTop: '8px' }}>
              问题下的回答，你阅读
              <span
                className='text-r-pink'
                style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '18px',
                }}
              >
                {consumeMostAnswerPvCnt}
              </span>
              次<div style={{ paddingTop: '8px' }}>那是你心底的珍藏吗？</div>
            </div>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
