"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P19Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P19 spec (社交-圈子用户)
  const joinClubCount = reportData?.join_club_cnt ?? null;
  const joinClubPercentage = reportData?.join_club_percentage ?? null;
  const consumeMostClubName = reportData?.consume_most_club_name ?? null;
  const consumeMostClubPv = reportData?.consume_most_club_pv ?? null;
  const interactiveMostClubName = reportData?.interactive_most_club_name ?? null;
  const interactiveMostClubCommentCount = reportData?.interactive_most_club_comment_cnt ?? null;
  const interactiveMostClubUpvoteCount = reportData?.interactive_most_club_upvote_cnt ?? null;
  const interactionMostPinClubName = reportData?.interaction_most_pin_club_name ?? null;
  const interactionMostPinTitle = reportData?.interaction_most_pin_title ?? null;
  const interactionMostPinInteractionCount = reportData?.interaction_most_pin_interaction_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        在这里,真诚的人同路亦同心
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          2025年,你加入了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(joinClubCount ?? 'join_club_cnt')}</span> 个圈子,对同好社交的热情超过了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(joinClubPercentage ?? 'join_club_percentage')}</span>% 的知友
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(consumeMostClubName ?? 'consume_most_club_name')}</span>」圈是你停留最久的地方,你曾在这驻足 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(consumeMostClubPv ?? 'consume_most_club_pv')}</span> 次
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          你在「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactiveMostClubName ?? 'interactive_most_club_name')}</span>」圈留下了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactiveMostClubCommentCount ?? 'interactive_most_club_comment_cnt')}</span> 条讨论、<span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactiveMostClubUpvoteCount ?? 'interactive_most_club_upvote_cnt')}</span> 个赞同
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          每一次正向互动,都促成了一场小小的「精神共振」
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          你在「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactionMostPinClubName ?? 'interaction_most_pin_club_name')}</span>」圈的帖子「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactionMostPinTitle ?? 'interaction_most_pin_title')}</span>」引发了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactionMostPinInteractionCount ?? 'interaction_most_pin_interaction_cnt')}</span> 次讨论
        </div>
      </div>

      <div className="text-sm">
        在圈子里,你的声音,总会收获回应
      </div>
    </BaseScene>
  );
}

