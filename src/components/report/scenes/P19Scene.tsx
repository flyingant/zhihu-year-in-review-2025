'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import GlitchLayer from '../effects/GlitchLayer';
import { truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P19Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, pink, tiffany, yellow, blue } = assets.report.p19;
  const { blue15, blue16, mix15_1, mix15_2, mix16_1, mix19 } = assets.report.bg;

  // Map context data to component variables according to P19 spec (社交-圈子用户)
  const joinClubCount = reportData?.join_club_cnt ?? null;
  const joinClubPercentage =
    reportData?.join_club_percentage != null
      ? Number(reportData.join_club_percentage).toFixed(2)
      : null;
  const consumeMostClubName = reportData?.consume_most_club_name ?? null;
  const consumeMostClubPv = reportData?.consume_most_club_pv ?? null;
  const interactiveMostClubName =
    reportData?.interactive_most_club_name ?? null;
  const interactiveMostClubCommentCount =
    reportData?.interactive_most_club_comment_cnt ?? null;
  const interactiveMostClubUpvoteCount =
    reportData?.interactive_most_club_upvote_cnt ?? null;
  const interactionMostPinClubName =
    reportData?.interaction_most_pin_club_name ?? null;
  const interactionMostPinTitle =
    reportData?.interaction_most_pin_title ?? null;
  const interactionMostPinInteractionCount =
    reportData?.interaction_most_pin_interaction_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <GlitchLayer>
        <div className='z-0'>
          <Image
            src={mix16_1.url}
            alt={mix16_1.alt}
            width={mix16_1.width}
            height={mix16_1.height}
            className='object-contain absolute pointer-events-none select-none z-10'
            style={{
              top: '131px',
              right: '1px',
              width: '87px',
              height: '24px',
            }}
          />
          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '173px',
              right: '26px',
              width: '27px',
              height: '27px',
            }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '32px', left: '17px', width: '35px', height: '35px' }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '763px',
              right: '72px',
              width: '32px',
              height: '34px',
            }}
          />
          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '112px',
              left: '264px',
              width: '124px',
              height: '30px',
            }}
          />
          <Image
            src={mix15_2.url}
            alt={mix15_2.alt}
            width={mix15_2.width}
            height={mix15_2.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '459px',
              right: '-4px',
              width: '117px',
              height: '26px',
            }}
          />
          <Image
            src={mix19.url}
            alt={mix19.alt}
            width={mix19.width}
            height={mix19.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '724px', left: '1px' }}
          />
        </div>
      </GlitchLayer>

      {/* main images */}
      <div className='z-0'>
        <Image
          src={liukanshan.url}
          alt={liukanshan.alt}
          width={liukanshan.width}
          height={liukanshan.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '440px', left: '0' }}
        />
        <Image
          src={pink.url}
          alt={pink.alt}
          width={pink.width}
          height={pink.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '80px', left: '1px' }}
        />
        <div className='relative' style={{ width: tiffany.width }}>
          <Image
            src={tiffany.url}
            alt={tiffany.alt}
            width={tiffany.width}
            height={tiffany.height}
            className='absolute pointer-events-none select-none z-1'
            style={{ top: '542px', left: '0' }}
          />
        </div>

        <Image
          src={yellow.url}
          alt={yellow.alt}
          width={yellow.width}
          height={yellow.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '268px', left: '1px' }}
        />
        <Image
          src={blue.url}
          alt={blue.alt}
          width={blue.width}
          height={blue.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '307px', left: '1px' }}
        />
      </div>

      {/* content */}
      <div className='z-0 tracking-wide' style={{ fontSize: '14px' }}>
        {joinClubCount && (
          <div
            className='absolute'
            style={{ fontSize: '14px', top: '184px', left: '36px' }}
          >
            <span className='pr-[4px]' style={{ fontSize: '18px' }}>
              2025
            </span>
            年 , 你加入了
            <span className='text-r-pink px-[7px]' style={{ fontSize: '24px' }}>
              {String(joinClubCount ?? 'join_club_cnt')}
            </span>
            个圈子 <br />
            {joinClubPercentage && (
              <>
                <span className='mt-5'>对同好社交的热情超过了</span>
                <span
                  className='text-r-green'
                  style={{
                    fontSize: '18px',
                    marginLeft: '7px',
                    marginRight: '7px',
                  }}
                >
                  {String(joinClubPercentage ?? 'join_club_percentage')}%
                </span>
                的知友
              </>
            )}
          </div>
        )}
        {consumeMostClubPv && (
          <div className='absolute' style={{ top: '360px', left: '141px' }}>
            <div className='mb-[10px]'>
              你在
              <span
                className='text-r-purple px-[7px]'
                style={{ fontSize: '16px' }}
              >
                「
                {truncateText(
                  String(consumeMostClubName ?? 'consume_most_club_name')
                )}
                」
              </span>
              <br />
              停留最久，驻足
              <span
                className='text-r-blue px-[7px]'
                style={{ fontSize: '18px' }}
              >
                {String(consumeMostClubPv ?? 'consume_most_club_pv')}
              </span>
              次
            </div>
          </div>
        )}
        {(!!interactiveMostClubCommentCount ||
          !!interactiveMostClubUpvoteCount) && (
          <div className='absolute z-2' style={{ top: '540px', left: '17px' }}>
            <div>
              在
              <span
                className='text-r-yellow'
                style={{ padding: '0 4px', fontSize: 16 }}
              >
                「
                {truncateText(
                  String(
                    interactiveMostClubName ?? 'interactive_most_club_name'
                  )
                )}
                」
              </span>
              圈 <br />
              你留下了
              <span
                className='text-r-green'
                style={{ padding: '0 4px', fontSize: 18 }}
              >
                {String(
                  interactiveMostClubCommentCount ??
                    'interactive_most_club_comment_cnt'
                )}
              </span>
              条讨论 <br />
              <span className='text-r-pink pr-[7px]' style={{ fontSize: 18 }}>
                {String(
                  interactiveMostClubUpvoteCount ??
                    'interactive_most_club_upvote_cnt'
                )}
              </span>
              个赞同 <br />
              <span>真诚的人同路亦同心</span>
            </div>
          </div>
        )}
      </div>
    </BaseScene>
  );
}
