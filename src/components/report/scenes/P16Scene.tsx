import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import ActionsButton from '@/components/ui/ActionsButton';
import GlitchLayer from '../effects/GlitchLayer';
import { useFollow } from '@/hooks/useFollow';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P16Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  const consumeInterestMemberTokenTop1 =
    reportData?.consume_interest_member_token_top1 as string | undefined;
  const consumeInterestMemberTokenTop2 =
    reportData?.consume_interest_member_token_top2 as string | undefined;
  const consumeInterestMemberTokenTop3 =
    reportData?.consume_interest_member_token_top3 as string | undefined;

  const { isFollowed: isTop1Followed, toggleFollow: toggleFollowTop1 } =
    useFollow(consumeInterestMemberTokenTop1);
  const { isFollowed: isTop2Followed, toggleFollow: toggleFollowTop2 } =
    useFollow(consumeInterestMemberTokenTop2);
  const { isFollowed: isTop3Followed, toggleFollow: toggleFollowTop3 } =
    useFollow(consumeInterestMemberTokenTop3);

  if (!assets) return null;

  const { thumbUp } = assets.report.p16;
  const { blue15, blue16, mix15_1, mix16_1, mix16_2 } = assets.report.bg;

  // Map context data to component variables according to P16 spec (社交-我关注的)
  const sendUpvoteCount = reportData?.send_upvote_cnt ?? null;
  const consumeMemberName = reportData?.consume_member_name ?? null;
  const sendMostUpvoteCount = reportData?.send_most_upvote_cnt ?? null;
  const sendMostUpvoteMemberName =
    reportData?.send_most_upvote_member_name ?? null;
  const interestMemberName1 =
    reportData?.consume_interest_member_name_top1 ?? null;
  const interestMemberName2 =
    reportData?.consume_interest_member_name_top2 ?? null;
  const interestMemberName3 =
    reportData?.consume_interest_member_name_top3 ?? null;

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
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '16px', right: '0' }}
          />

          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{ top: '298px', left: '0' }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '112px', right: '78px' }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '753px', left: '72px' }}
          />
          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '79px', left: '0' }}
          />
          <Image
            src={mix16_2.url}
            alt={mix16_2.alt}
            width={mix16_2.width}
            height={mix16_2.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '689px', right: '0' }}
          />
        </div>
      </GlitchLayer>

      {/* main image */}
      <div className='z-0'>
        <Image
          src={thumbUp.url}
          alt={thumbUp.alt}
          width={thumbUp.width}
          height={thumbUp.height}
          className='w-full absolute pointer-events-none select-none z-0'
          style={{ top: '127px', left: '0' }}
        />
      </div>
      {/* content */}
      <div
        className='tracking-wide'
        style={{
          position: 'absolute',
          zIndex: 0,
          fontSize: 14,
          top: '371px',
          left: '35px',
        }}
      >
        {!!sendUpvoteCount && (
          <>
            <div className='leading-relaxed' style={{ marginBottom: '12px' }}>
              今年，你点亮了
              <span
                className={`text-r-pink`}
                style={{
                  fontSize: 18,
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
              >
                {String(sendUpvoteCount ?? 'send_upvote_cnt')}
              </span>
              次赞同
            </div>
            <div style={{ marginBottom: '42px' }}>每次都是直达心灵的触动</div>
          </>
        )}

        {!!consumeMemberName && (
          <div style={{ marginBottom: '8px' }}>
            你最常停在
            <span
              className={`text-r-yellow`}
              style={{ fontSize: 14, paddingLeft: '4px', paddingRight: '4px' }}
            >
              @{String(consumeMemberName ?? 'consume_member_name')}
            </span>
            的页面
          </div>
        )}

        {!!sendMostUpvoteCount && (
          <>
            <div style={{ paddingBottom: '40px' }}>
              <div className=''>
                最多的
                <span
                  className={`text-r-fern`}
                  style={{
                    fontSize: 24,
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }}
                >
                  {String(sendMostUpvoteCount ?? 'send_most_upvote_cnt')}
                </span>
                个赞同，给了
                <span
                  className={`text-r-yellow`}
                  style={{
                    fontSize: 14,
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }}
                >
                  @{String(sendMostUpvoteMemberName ?? 'sote_member_name')}
                </span>
              </div>
            </div>
          </>
        )}

        <div
          style={{ fontSize: 14 }}
          hidden={
            !interestMemberName1 && !interestMemberName2 && !interestMemberName3
          }
        >
          <span>看看</span>
          <span
            className={`text-r-blue flex items-center ${
              interestMemberName1 ? '' : 'hidden'
            }`}
            hidden={!interestMemberName1}
            style={{
              paddingLeft: '2px',
              paddingRight: '2px',
              marginBottom: '8px',
              marginTop: '10px',
            }}
          >
            @
            {String(interestMemberName1 ?? 'consume_interest_member_name_top1')}
            <ActionsButton
              style={{ marginLeft: '7px' }}
              type={isTop1Followed ? 'subscribed' : 'subscribe'}
              onClick={toggleFollowTop1}
            />
          </span>
          <span
            className={`text-r-blue flex items-center ${
              interestMemberName2 ? '' : 'hidden'
            }`}
            hidden={!interestMemberName2}
            style={{
              paddingLeft: '2px',
              paddingRight: '2px',
              marginBottom: '8px',
            }}
          >
            @
            {String(interestMemberName2 ?? 'consume_interest_member_name_top2')}
            <ActionsButton
              style={{ marginLeft: '7px' }}
              type={isTop2Followed ? 'subscribed' : 'subscribe'}
              onClick={toggleFollowTop2}
            />
          </span>
          <span
            className={`text-r-blue flex items-center ${
              interestMemberName3 ? '' : 'hidden'
            }`}
            hidden={!interestMemberName3}
            style={{
              paddingLeft: '2px',
              paddingRight: '2px',
              marginBottom: '8px',
            }}
          >
            @
            {String(interestMemberName3 ?? 'consume_interest_member_name_top3')}
            <ActionsButton
              style={{ marginLeft: '7px' }}
              type={isTop3Followed ? 'subscribed' : 'subscribe'}
              onClick={toggleFollowTop3}
            />
          </span>
          <div>或许也能给你一丝启发</div>
        </div>
      </div>
    </BaseScene>
  );
}
