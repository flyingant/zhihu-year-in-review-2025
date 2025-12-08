"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P15Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P15 spec (社交-关注我的)
  const newFollowCount = reportData?.new_follow_cnt ?? null;
  const mostUpvoteMemberName = reportData?.most_upvote_member_name ?? null;
  const mostUpvoteMemberUpvote = reportData?.most_upvote_member_upvote ?? null;
  const interactionMostMemberName = reportData?.interaction_most_member_name ?? null;
  const thanksInvitationDate = reportData?.thanks_invitation_date ?? null;
  const thanksInvitationQuestionTitle = reportData?.thanks_invitation_question_title ?? null;
  const thanksInvitationMemberName = reportData?.thanks_invitation_member_name ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        真实的连接,从点滴发生
      </div>

      <div className="pt-[60px] pb-[20px]">
        2025,有 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(newFollowCount ?? 'new_follow_cnt')}</span> 位知友选择关注你
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          最懂你的是 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostUpvoteMemberName ?? 'most_upvote_member_name')}</span>
        </div>
        <div className="text-sm">
          TA用 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(mostUpvoteMemberUpvote ?? 'most_upvote_member_upvote')}</span> 个赞同回应你的表达
        </div>
      </div>

      <div className="pb-[30px]">
        和你互动最多的,是 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>@{String(interactionMostMemberName ?? 'interaction_most_member_name')}</span>
      </div>

      <div className="text-sm">
        <div className="mb-[10px]">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(thanksInvitationDate ?? 'thanks_invitation_date')}</span> 你在 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(thanksInvitationQuestionTitle ?? 'thanks_invitation_question_title')}</span> 问题下
        </div>
        <div>
          回应了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>@{String(thanksInvitationMemberName ?? 'thanks_invitation_member_name')}</span> 的热情,写下今年的第一个「谢邀」
        </div>
      </div>
    </BaseScene>
  );
}

