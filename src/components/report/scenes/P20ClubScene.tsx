'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import GlitchLayer from '../effects/GlitchLayer';
import ActionsButton from '@/components/ui/ActionsButton';
import { truncateText } from '@/utils/common';
import {
  getCircleMembershipStatus,
  joinCircle,
  leaveCircle,
} from '@/api/report';
import { useToast } from '@/context/toast-context';
import { useState, useEffect, useMemo } from 'react';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

const ClubInterestItem = ({
  name,
  avatar,
  fallbackName,
  type = 'join',
  onClick,
  disabled = false,
}: {
  name: unknown;
  avatar?: string | null;
  fallbackName?: string;
  type?: 'join' | 'joined';
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <span
      className='flex items-center text-r-green px-[2px]'
      style={{ fontSize: 18 }}
    >
      <div className='flex items-center' style={{ gap: '2px' }}>
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
        <span className='text-r-yellow px-[2px]' style={{ fontSize: 16 }}>
          {String(name ?? fallbackName)}
        </span>
      </div>
      <ActionsButton
        className='ml-[7px]'
        type={type}
        onClick={onClick || (() => {})}
        disabled={disabled}
      />
    </span>
  );
};

export default function P20Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  const { showToast } = useToast();

  // State to track membership status for each club
  const [membershipStatus, setMembershipStatus] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Club IDs - extract before early return
  const clubInterestListId1 = reportData?.club_interest_list_id_top1 ?? null;
  const clubInterestListId2 = reportData?.club_interest_list_id_top2 ?? null;
  const clubInterestListId3 = reportData?.club_interest_list_id_top3 ?? null;

  // Check membership status on mount
  useEffect(() => {
    const checkMembershipStatuses = async () => {
      const ids = [
        { id: clubInterestListId1, key: 'club1' },
        { id: clubInterestListId2, key: 'club2' },
        { id: clubInterestListId3, key: 'club3' },
      ].filter((item) => item.id !== null);

      for (const { id, key } of ids) {
        try {
          const status = await getCircleMembershipStatus(String(id));
          setMembershipStatus((prev) => ({
            ...prev,
            [key]: status.is_joined,
          }));
        } catch (error) {
          console.error(`Error checking membership for club ${id}:`, error);
          // Default to false if check fails
          setMembershipStatus((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      }
    };

    if (clubInterestListId1 || clubInterestListId2 || clubInterestListId3) {
      checkMembershipStatuses();
    }
  }, [clubInterestListId1, clubInterestListId2, clubInterestListId3]);

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

  // Compute active clubs list
  const activeClubs = useMemo(
    () =>
      [clubActiveListName1, clubActiveListName2, clubActiveListName3].filter(
        Boolean
      ),
    [clubActiveListName1, clubActiveListName2, clubActiveListName3]
  );

  // Compute interest clubs list
  const interestClubs = useMemo(
    () =>
      [
        {
          name: clubInterestListName1,
          avatar: clubInterestListAvatar1,
          id: clubInterestListId1,
          key: 'club1',
          fallbackName: 'club_interest_list_name_top1',
        },
        {
          name: clubInterestListName2,
          avatar: clubInterestListAvatar2,
          id: clubInterestListId2,
          key: 'club2',
          fallbackName: 'club_interest_list_name_top2',
        },
        {
          name: clubInterestListName3,
          avatar: clubInterestListAvatar3,
          id: clubInterestListId3,
          key: 'club3',
          fallbackName: 'club_interest_list_name_top3',
        },
      ].filter((club) => club.name),
    [
      clubInterestListName1,
      clubInterestListAvatar1,
      clubInterestListId1,
      clubInterestListName2,
      clubInterestListAvatar2,
      clubInterestListId2,
      clubInterestListName3,
      clubInterestListAvatar3,
      clubInterestListId3,
    ]
  );

  // Handler for toggling circle membership
  const handleToggleMembership = async (
    ringId: string | null,
    clubKey: string
  ) => {
    if (!ringId) {
      showToast('圈子ID不存在', 'error');
      return;
    }

    const ringIdStr = String(ringId);
    const isCurrentlyJoined = membershipStatus[clubKey] ?? false;

    setLoadingStates((prev) => ({ ...prev, [clubKey]: true }));

    try {
      if (isCurrentlyJoined) {
        // Leave the circle
        await leaveCircle(ringIdStr);
        setMembershipStatus((prev) => ({
          ...prev,
          [clubKey]: false,
        }));
        showToast('已退出圈子', 'success');
      } else {
        // Join the circle
        await joinCircle(ringIdStr);
        setMembershipStatus((prev) => ({
          ...prev,
          [clubKey]: true,
        }));
        showToast('已加入圈子', 'success');
      }
    } catch (error) {
      console.error('Error toggling circle membership:', error);
      showToast(
        isCurrentlyJoined
          ? '退出圈子失败，请稍后重试'
          : '加入圈子失败，请稍后重试',
        'error'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [clubKey]: false }));
    }
  };

  if (!assets) return null;

  const { main, gif } = assets.report.p20;
  const { blue15, blue16, mix15_1, mix16_1, mix20 } = assets.report.bg;

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
          {activeClubs.length > 0 && (
            <div
              className='z-30 absolute'
              style={{
                fontSize: '16px',
                top: '145px',
                left: '34px',
                right: '34px',
                lineHeight: '24px',
              }}
            >
              {activeClubs.map((clubName, index) => (
                <span key={index} className='text-r-pink'>
                  {`「${truncateText(String(clubName))}」`}
                  {index < activeClubs.length - 1 ? '，' : ''}
                </span>
              ))}
              <span>圈子是你今年最爱的精神据点</span>
            </div>
          )}

          {/* Recommended Clubs */}
          {interestClubs.length > 0 && (
            <div
              className='absolute z-30'
              style={{
                fontSize: 16,
                top: '583px',
                left: '34px',
                right: '34px',
              }}
            >
              <div className='flex flex-col' style={{ gap: '8px' }}>
                {interestClubs.map((club) => (
                  <ClubInterestItem
                    key={club.key}
                    name={club.name}
                    avatar={club.avatar}
                    fallbackName={club.fallbackName}
                    type={membershipStatus[club.key] ? 'joined' : 'join'}
                    onClick={() => handleToggleMembership(club.id, club.key)}
                    disabled={loadingStates[club.key]}
                  />
                ))}
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
