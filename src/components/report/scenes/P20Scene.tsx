"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P20Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P20 spec (社交圈子用户)
  // Night Club Publish
  const nightClubPinTime = reportData?.night_club_pin_time ?? null;
  const nightClubPinClubName = reportData?.night_club_pin_club_name ?? null;
  const nightClubPinTitle = reportData?.night_club_pin_title ?? null;
  
  // Club Friend Count / Expansion
  const clubFriendCount = reportData?.club_friend_cnt ?? null;
  
  // Most Interacted Club Members
  const mostInteractionMemberName1 = reportData?.most_interaction_club_member_name_top1 ?? null;
  const mostInteractionMemberName2 = reportData?.most_interaction_club_member_name_top2 ?? null;
  const mostInteractionMemberName3 = reportData?.most_interaction_club_member_name_top3 ?? null;
  
  // Most Active Clubs / "Spiritual Strongholds"
  const clubActiveListName1 = reportData?.club_active_list_name_top1 ?? null;
  const clubActiveListName2 = reportData?.club_active_list_name_top2 ?? null;
  const clubActiveListName3 = reportData?.club_active_list_name_top3 ?? null;
  
  // Recommended Clubs / "Next Stop"
  const clubInterestListName1 = reportData?.club_interest_list_name_top1 ?? null;
  const clubInterestListName2 = reportData?.club_interest_list_name_top2 ?? null;
  const clubInterestListName3 = reportData?.club_interest_list_name_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* Night Club Publish */}
      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(nightClubPinTime ?? 'night_club_pin_time')}</span> 你在 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(nightClubPinClubName ?? 'night_club_pin_club_name')}</span> 圈子发布了一条内容 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(nightClubPinTitle ?? 'night_club_pin_title')}</span>
        </div>
      </div>

      {/* Club Friend Count / Expansion */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          今年,你在圈子里一共「扩列」了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubFriendCount ?? 'club_friend_cnt')}</span> 位好友
        </div>
        <div className="text-sm">
          希望新的一年,你能结识更多同道中人
        </div>
      </div>

      {/* Most Interacted Club Members */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          2025年,跟你互动最多的圈友是 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostInteractionMemberName1 ?? 'most_interaction_club_member_name_top1')}</span>、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostInteractionMemberName2 ?? 'most_interaction_club_member_name_top2')}</span>、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostInteractionMemberName3 ?? 'most_interaction_club_member_name_top3')}</span>
        </div>
        <div className="text-sm">
          要不要发私信,给他们送上感谢和祝福?
        </div>
      </div>

      {/* Most Active Clubs / "Spiritual Strongholds" */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubActiveListName1 ?? 'club_active_list_name_top1')}</span>」、「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubActiveListName2 ?? 'club_active_list_name_top2')}</span>」、「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubActiveListName3 ?? 'club_active_list_name_top3')}</span>」是你今年最爱的「精神据点」
        </div>
      </div>

      {/* Recommended Clubs / "Next Stop" */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          而 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubInterestListName1 ?? 'club_interest_list_name_top1')}</span>、<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubInterestListName2 ?? 'club_interest_list_name_top2')}</span>、<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubInterestListName3 ?? 'club_interest_list_name_top3')}</span> 圈 或许会是你的下一站
        </div>
        <div className="text-sm">
          点击加入,一起开启新年新旅程吧
        </div>
      </div>
    </BaseScene>
  );
}

