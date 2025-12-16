'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P23Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { review } = assets.report.p23;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P23 spec (特殊-答主评审团)
  const reviewAnswerCount = reportData?.review_answer_cnt ?? null;
  const reviewAnswerProductName =
    reportData?.review_answer_product_name ?? null;

  // if (!reviewAnswerCount) {
  //   console.log("redirect to next page");
  //   return null;
  // }

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt='{mix22_1.alt}'
          width={mix22_1.width}
          height={mix22_1.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '23px', left: '0' }}
        />
        <Image
          src={mix22_4.url}
          alt='{mix22_4.alt}'
          width={mix22_4.width}
          height={mix22_4.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '758px', right: '0' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '208px', left: '316px' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '752px', left: '44px' }}
        />
      </GlitchLayer>
      {/* images */}
      <div className='z-0'>
        <Image
          src={review.url}
          alt='{review.alt}'
          width={review.width}
          height={review.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '456px', left: '0' }}
        />
      </div>
      {/* content */}
      <div className='z-0 tracking-wide' style={{ fontSize: 13 }}>
        <div
          className='leading-relaxed absolute'
          style={{ fontSize: 22, top: '116px', left: '41px' }}
        >
          你的判断，
          <br />
          构成了内容世界里的
          <br />
          那一份「真」
        </div>

        <div className='absolute' style={{ top: '274px', left: '41px' }}>
          <div className='mb-[10px]'>
            2025 年，你在
            <span className='text-r-purple px-[7px]'>@答主评审团</span>
            的测评中
            <br />
            探寻了
            <span className={`text-r-fern px-[7px]`} style={{ fontSize: 24 }}>
              {String(reviewAnswerCount ?? 'review_answer_cnt')}
            </span>
            次
          </div>
        </div>

        {!!reviewAnswerProductName && (
          <div className='absolute' style={{ top: '371px', left: '41px' }}>
            <div className='mb-[10px]'>
              其中关于
              <span
                className={`text-r-green px-[7px]`}
                style={{ fontSize: 16 }}
              >
                {String(
                  reviewAnswerProductName ?? 'review_answer_product_name'
                )}
              </span>
              的测评
              <br />
              你用互动表达了对内容
              <span className='text-r-pink px-[7px]' style={{ fontSize: 16 }}>
                「真」的认可
              </span>
            </div>
          </div>
        )}
      </div>
    </BaseScene>
  );
}
