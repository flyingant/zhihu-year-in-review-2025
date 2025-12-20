'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P22Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { front, back, gif } = assets.report.p22;
  const { mix22_1, mix22_2, mix22_3, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P22 spec (特殊-热点数据)
  // Billboard browsing
  const consumeBillboardDays = reportData?.consume_billboard_days ?? null;
  const consumeBillboardContentCount =
    reportData?.consume_billboard_content_cnt ?? null;

  // Upvoted content on billboard
  const upvoteZhihuBillboardContentCount =
    reportData?.upvote_zhihu_billboard_content_cnt ?? null;

  // Hot events
  const eventMonth = reportData?.event_month ?? null;
  const eventName = reportData?.event_name ?? null;
  const eventUpvoteCount = reportData?.event_upvote_cnt ?? null;
  const eventMemberCount = reportData?.event_member_cnt ?? null;

  // Event hours
  const eventMostHourName = reportData?.event_most_hour_name ?? null;
  const eventMostHour = reportData?.event_most_hour ?? null;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      {/* mix block */}
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
          src={mix22_2.url}
          alt='{mix22_2.alt}'
          width={mix22_2.width}
          height={mix22_2.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '93px', right: '0' }}
        />
        <Image
          src={mix22_3.url}
          alt='{mix22_3.alt}'
          width={mix22_3.width}
          height={mix22_3.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '438px', left: '0' }}
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
          src={front.url}
          alt='{front.alt}'
          width={front.width}
          height={front.height}
          className='object-contain absolute pointer-events-none select-none z-20'
          style={{ top: '426px', right: '0', left: '0' }}
        />
        <Image
          src={back.url}
          alt='{back.alt}'
          width={back.width}
          height={back.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '242px', right: '0' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.url}
          alt={gif.alt}
          width={gif.width / 2}
          height={gif.height / 2}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '603px', left: '135px' }}
        />
      </div>
      {/* content */}
      <div className='z-0 relative tracking-wide' style={{ fontSize: 16 }}>
        <div
          className='absolute leading-loose'
          style={{ fontSize: 22, top: '116px', left: '41px' }}
        >
          当你面向时代求真
          <br />
          时代也在折射你
        </div>
        {/* Billboard browsing */}
        <div
          className='absolute'
          style={{ top: '214px', left: '41px', right: '20px', fontSize: 16 }}
        >
          <p hidden={!consumeBillboardDays || consumeBillboardDays < 5}>
            今年，你驻扎热榜
            <span className={`text-r-fern px-[4px]`} style={{ fontSize: 24 }}>
              {String(consumeBillboardDays ?? 'consume_billboard_days')}
            </span>
            天
          </p>
          <p hidden={!consumeBillboardContentCount}>
            浏览了
            <span className={`text-r-fern px-[4px]`} style={{ fontSize: 24 }}>
              {String(
                consumeBillboardContentCount ?? 'consume_billboard_content_cnt'
              )}
            </span>
            条热榜内容
          </p>
          {/* Upvoted content on billboard */}
          <p hidden={!upvoteZhihuBillboardContentCount}>
            你的赞同, 助推
            <span className={`text-r-fern px-[4px]`} style={{ fontSize: 24 }}>
              {String(
                upvoteZhihuBillboardContentCount ??
                  'upvote_zhihu_billboard_content_cnt'
              )}
            </span>
            篇内容登上了知乎热榜
          </p>

          {/* Hot events */}
          <div style={{ marginTop: 16 }} hidden={!eventUpvoteCount}>
            <span className='text-r-pink mr-[4px]'>{eventMonth}</span>
            月里，你参与了
            <span className='text-r-pink mx-[4px]'>{eventName}</span>
            的讨论，收获
            <span className='text-r-pink mx-[4px]'>{eventUpvoteCount}</span>
            个赞同，和无数人共同记录那段集体记忆
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
