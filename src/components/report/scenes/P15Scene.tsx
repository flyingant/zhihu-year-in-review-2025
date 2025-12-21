'use client';

import Image from 'next/image';
import { useUserReportData } from '@/context/user-report-data-context';
import { useAssets } from '@/context/assets-context';
import BaseScene from './BaseScene';
import GlitchLayer from '../effects/GlitchLayer';
import { format } from 'date-fns';
import { truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P15Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { blue15, mix15, mix15_1, mix15_2 } = assets.report.bg;
  const { ladder, year, gif1, gif2, gif3 } = assets.report.p15;

  // Map context data to component variables according to P15 spec (社交-关注我的)
  const newFollowCount = reportData?.new_follow_cnt ?? null;
  const mostUpvoteMemberName = reportData?.most_upvote_member_name ?? null;
  const mostUpvoteMemberUpvote = reportData?.most_upvote_member_upvote ?? null;
  const interactionMostMemberName =
    reportData?.interaction_most_member_name ?? null;
  const { thanksInvitationMonth, thanksInvitationDay } =
    reportData?.thanks_invitation_date
      ? {
          thanksInvitationMonth: format(
            new Date(reportData.thanks_invitation_date),
            'MM'
          ),
          thanksInvitationDay: format(
            new Date(reportData.thanks_invitation_date),
            'dd'
          ),
        }
      : {
          thanksInvitationMonth: null,
          thanksInvitationDay: null,
        };
  const thanksInvitationQuestionTitle =
    reportData?.thanks_invitation_question_title ?? null;
  const thanksInvitationMemberName =
    reportData?.thanks_invitation_member_name ?? null;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      {/* background */}
      <GlitchLayer>
        <div className='z-0'>
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{ top: '74px', left: '0' }}
          />

          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '234px', right: '21px' }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '682px', left: '10px' }}
          />

          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '470px', right: '19px' }}
          />
          <Image
            src={mix15_2.url}
            alt={mix15_2.alt}
            width={mix15_2.width}
            height={mix15_2.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '486px', right: '0' }}
          />
          <Image
            src={mix15.url}
            alt={mix15.alt}
            width={mix15.width}
            height={mix15.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '689px', right: '0' }}
          />
        </div>
      </GlitchLayer>
      {/* main picture */}
      <div className='z-0'>
        <Image
          src={ladder.url}
          alt={ladder.alt}
          width={ladder.width}
          height={ladder.height}
          className='object-contain absolute pointer-events-none select-none z-0 w-full'
          style={{ top: '155px', left: '0' }}
        />
        <Image
          src={gif1.url}
          alt={gif1.alt}
          width={gif1.width}
          height={gif1.height}
          className='object-contain absolute pointer-events-none select-none z-0 w-full'
          style={{ top: '155px', left: '0', right: '0', width: gif1.width }}
        />
        <Image
          src={gif2.url}
          alt={gif2.alt}
          width={gif2.width}
          height={gif2.height}
          className='object-contain absolute pointer-events-none select-none z-0 w-full'
          style={{ left: '-5px', top: '479px', width: gif2.width }}
        />
        <Image
          src={gif3.url}
          alt={gif3.alt}
          width={gif3.width}
          height={gif3.height}
          className='object-contain absolute pointer-events-none select-none z-0 w-full'
          style={{ top: '285px', right: '0', width: gif3.width }}
        />
      </div>
      {/* content */}
      <div
        className='z-0 tracking-wide'
        style={{ fontSize: 16, paddingTop: '100px' }}
      >
        <span
          className={'text-xl absolute leading-relaxed'}
          style={{ left: '32px' }}
        >
          真实的连接，从点滴开启
        </span>

        {!!newFollowCount && (
          <div className='absolute' style={{ left: '160px', top: '172px' }}>
            <span style={{ paddingRight: '6px' }}>2025</span>
            <span>年</span> <br />有
            <span
              className='text-r-fern'
              style={{ fontSize: 23, paddingLeft: '6px', paddingRight: '6px' }}
            >
              {String(newFollowCount ?? 'new_follow_cnt')}
            </span>
            位知友关注你
          </div>
        )}

        <div
          className='absolute leading-relaxed'
          style={{ top: '330px', left: '19px' }}
        >
          {!!mostUpvoteMemberName && (
            <>
              <div className=''>
                最懂你的是
                <span
                  className={`text-r-yellow`}
                  style={{
                    fontSize: 16,
                    paddingLeft: '6px',
                    paddingRight: '6px',
                  }}
                >
                  @{String(mostUpvoteMemberName ?? 'most_upvote_member_name')}
                </span>
              </div>
              <div hidden={!mostUpvoteMemberUpvote}>
                TA用
                <span
                  className={` text-r-green`}
                  style={{
                    fontSize: 18,
                    paddingLeft: '6px',
                    paddingRight: '6px',
                  }}
                >
                  {String(
                    mostUpvoteMemberUpvote ?? 'most_upvote_member_upvote'
                  )}
                </span>
                个赞同认可你的表达
              </div>
            </>
          )}

          {!!interactionMostMemberName && (
            <div>
              和你互动最多的是
              <span
                className={` text-r-pink`}
                style={{
                  fontSize: 16,
                  paddingLeft: '6px',
                  paddingRight: '6px',
                }}
              >
                @
                {String(
                  interactionMostMemberName ?? 'interaction_most_member_name'
                )}
              </span>
            </div>
          )}
        </div>

        {!!thanksInvitationMemberName && (
          <div
            className='absolute'
            style={{ top: '566px', left: '114px', right: '20px' }}
          >
            <div
              className='text-r-green wrap-break-word'
              style={{ marginBottom: 6 }}
            >
              <span style={{ fontSize: 17, margin: '0 2px' }}>
                {String(thanksInvitationMonth ?? 'thanksInvitationMonth')}
              </span>
              月
              <span style={{ fontSize: 17, margin: '0 4px' }}>
                {String(thanksInvitationDay ?? 'thanksInvitationDay')}
              </span>
              日<span className='text-black mx-1'>你在</span>
              {/* <span className={` text-r-blue`} style={{ fontSize: 16 }}>
                @
                {String(
                  thanksInvitationMemberName ?? 'thanks_invitation_member_name'
                )}
              </span> */}
              <br />
              <span className={`text-r-yellow`} style={{ fontSize: 16 }}>
                {truncateText(
                  String(
                    thanksInvitationQuestionTitle ??
                      'thanks_invitation_question'
                  )
                )}
              </span>
            </div>
            <div>
              回应了
              <span
                className={` text-r-purple`}
                style={{
                  fontSize: 16,
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  lineHeight: '32px',
                }}
              >
                @
                {String(
                  thanksInvitationMemberName ?? 'thanks_invitation_member_name'
                )}
              </span>
              的热情 <br />
              <span>写下今年的第一个「谢邀」</span>
            </div>
          </div>
        )}
      </div>
    </BaseScene>
  );
}
