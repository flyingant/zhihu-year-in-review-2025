"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P17Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P17 spec (社交-互动内容)
  const followQuestionFriend = reportData?.follow_question_friend ?? null;
  const followQuestionFriendQuestionTitle = reportData?.follow_question_friend_question_title ?? null;
  const upvoteHotAnswerMemberName = reportData?.upvote_hot_answer_member_name ?? null;
  const upvoteHotAnswerTitle = reportData?.upvote_hot_answer_title ?? null;
  const upvoteHotAnswerUpvoteCount = reportData?.upvote_hot_answer_upvote_cnt ?? null;
  const upvoteHotAnswerUserCount = reportData?.upvote_hot_answer_user_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        因为同频,旅途不在孤独
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          你和 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(followQuestionFriend ?? 'follow_question_friend')}</span> 位好友共同关注着一个问题:
        </div>
        <div>
          「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(followQuestionFriendQuestionTitle ?? 'follow_question_friend_question_title')}</span>」
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          你赞同了 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>@{String(upvoteHotAnswerMemberName ?? 'upvote_hot_answer_member_name')}</span> 在「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(upvoteHotAnswerTitle ?? 'upvote_hot_answer_title')}</span>」问题下的回答
        </div>
        <div className="text-sm">
          <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(upvoteHotAnswerUserCount ?? 'upvote_hot_answer_user_cnt')}</span> 位知友也在此和你对上了频率
        </div>
      </div>
    </BaseScene>
  );
}

