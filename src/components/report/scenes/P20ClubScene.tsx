'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import GlitchLayer from '../effects/GlitchLayer';
import ActionsButton from '@/components/ui/ActionsButton';
import { truncateText } from '@/utils/common';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

const ClubInterestItem = ({
  name,
  avatar,
  fallbackName,
  type = 'join',
  onClick,
}: {
  name: unknown;
  avatar?: string | null;
  fallbackName?: string;
  type?: 'join' | 'joined';
  onClick?: () => void;
}) => {
  return (
    <span
      className='flex items-center text-r-green px-[2px]'
      style={{ fontSize: 18 }}
    >
      <div className='flex items-center gap-1'>
        <Image
          src={avatar ?? ''}
          alt={String(name ?? '')}
          width={32}
          height={32}
          className={`object-contain bg-slate-100`}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
          }}
        />
        <span className='text-r-yellow px-[2px]' style={{ fontSize: 14 }}>
          {String(name ?? fallbackName)}
        </span>
      </div>
      <ActionsButton
        className='ml-[7px]'
        type={type}
        onClick={onClick || (() => {})}
      />
    </span>
  );
};

export default function P20Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { main, gif } = assets.report.p20;
  const { blue15, blue16, mix15_1, mix16_1, mix20 } = assets.report.bg;

  // Map context data to component variables according to P20 spec (社交圈子用户)
  // Night Club Publish
  const nightClubPinTime = reportData?.night_club_pin_time ?? null;
  const nightClubPinClubName = reportData?.night_club_pin_club_name ?? null;
  const nightClubPinTitle = reportData?.night_club_pin_title ?? null;

  // Club Friend Count / Expansion
  const clubFriendCount = reportData?.club_friend_cnt ?? null;

  // Most Interacted Club Members
  const mostInteractionMemberName1 =
    reportData?.most_interaction_club_member_name_top1 ?? null;
  const mostInteractionMemberName2 =
    reportData?.most_interaction_club_member_name_top2 ?? null;
  const mostInteractionMemberName3 =
    reportData?.most_interaction_club_member_name_top3 ?? null;

  const mostInteractionMemberAvatar1 =
    reportData?.most_interaction_club_member_avatar_top1 ?? null;
  const mostInteractionMemberAvatar2 =
    reportData?.most_interaction_club_member_avatar_top2 ?? null;
  const mostInteractionMemberAvatar3 =
    reportData?.most_interaction_club_member_avatar_top3 ?? null;

  const clubInterestListAvatar1 =
    reportData?.club_interest_list_avatar_top1 ?? null;
  const clubInterestListAvatar2 =
    reportData?.club_interest_list_avatar_top2 ?? null;
  const clubInterestListAvatar3 =
    reportData?.club_interest_list_avatar_top3 ?? null;

  // Most Active Clubs / "Spiritual Strongholds"
  const clubActiveListName1 = reportData?.club_active_list_name_top1 ?? null;
  const clubActiveListName2 = reportData?.club_active_list_name_top2 ?? null;
  const clubActiveListName3 = reportData?.club_active_list_name_top3 ?? null;

  // Recommended Clubs / "Next Stop"
  const clubInterestListName1 =
    reportData?.club_interest_list_name_top1 ?? null;
  const clubInterestListName2 =
    reportData?.club_interest_list_name_top2 ?? null;
  const clubInterestListName3 =
    reportData?.club_interest_list_name_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <GlitchLayer>
        <div className='z-0'>
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain rotate-90 absolute pointer-events-none select-none z-0'
            style={{ top: '58px', left: '27px', width: '35px', height: '35px' }}
          />
          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '310px',
              right: '60px',
              width: '27px',
              height: '27px',
            }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{
              top: '742px',
              right: '66px',
              width: '34px',
              height: '34px',
            }}
          />
          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className='object-contain absolute pointer-events-none select-none z-0'
            style={{ top: '250px', left: '0', width: '124px', height: '30px' }}
          />
          <Image
            src={mix16_1.url}
            alt={mix16_1.alt}
            width={mix16_1.width}
            height={mix16_1.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{
              top: '268px',
              left: '18px',
              width: '88px',
              height: '24px',
            }}
          />

          <Image
            src={mix20.url}
            alt={mix20.alt}
            width={mix20.width}
            height={mix20.height}
            className='object-contain absolute pointer-events-none select-none z-1'
            style={{ top: '618px', right: '0' }}
          />
        </div>
      </GlitchLayer>

      {/* main images */}
      <div className='z-0'>
        <Image
          src={main.url}
          alt={main.alt}
          width={main.width}
          height={main.height}
          className='object-contain absolute pointer-events-none select-none z-20'
          style={{ top: '325px', left: '60px' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.url}
          alt={gif.alt}
          width={gif.width / 4}
          height={gif.height / 4}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '228px', right: '165px' }}
        />
      </div>

      {/* content */}
      <div className='z-0 tracking-wide'>
        <div className='spots'>
          {/* Most Favorite Spots */}
          {(!!clubActiveListName1 ||
            !!clubActiveListName2 ||
            !!clubActiveListName3) && (
            <div
              className='z-30 absolute'
              style={{
                fontSize: '14px',
                top: '145px',
                left: '34px',
                right: '34px',
                lineHeight: '24px',
              }}
            >
              {!!clubActiveListName1 && (
                <span className='text-r-pink'>
                  「
                  {truncateText(
                    String(clubActiveListName1 ?? 'club_active_list_name_top1')
                  )}
                  」
                </span>
              )}
              {!!clubActiveListName2 && (
                <span className='text-r-pink'>
                  「
                  {truncateText(
                    String(clubActiveListName2 ?? 'club_active_list_name_top2')
                  )}
                  」
                </span>
              )}
              {!!clubActiveListName3 && (
                <span className='text-r-pink'>
                  「
                  {truncateText(
                    String(clubActiveListName3 ?? 'club_active_list_name_top3')
                  )}
                  」
                </span>
              )}
              <span>圈子是你今年最爱的精神据点</span>
            </div>
          )}
          {/* Recommended Clubs */}
          {(!!clubInterestListName1 ||
            !!clubInterestListName2 ||
            !!clubInterestListName3) && (
            <div
              className='absolute z-30'
              style={{
                fontSize: 14,
                top: '583px',
                left: '34px',
                right: '34px',
              }}
            >
              <div className='flex flex-col gap-1 leading-[34px]'>
                {!!clubInterestListName1 && (
                  <ClubInterestItem
                    name={clubInterestListName1}
                    avatar={clubInterestListAvatar1}
                    fallbackName='club_interest_list_name_top1'
                    type='join'
                    onClick={() => {}}
                  />
                )}
                {!!clubInterestListName2 && (
                  <ClubInterestItem
                    name={clubInterestListName2}
                    avatar={clubInterestListAvatar2}
                    fallbackName='club_interest_list_name_top2'
                    type='join'
                    onClick={() => {}}
                  />
                )}
                {!!clubInterestListName3 && (
                  <ClubInterestItem
                    name={clubInterestListName3}
                    avatar={clubInterestListAvatar3}
                    fallbackName='club_interest_list_name_top3'
                    type='joined'
                    onClick={() => {}}
                  />
                )}
              </div>
              <div className='flex flex-col gap-2' style={{ marginTop: '8px' }}>
                <span>或许会是你的下一站</span>
                <span>点击加入一起开启新年新旅程吧</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseScene>
  );
}
