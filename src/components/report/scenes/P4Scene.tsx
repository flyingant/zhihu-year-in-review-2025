"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P4Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P4 spec
  const questionToken = reportData?.answer_most_upvote_question_token ?? null;
  const questionTitle = reportData?.answer_most_upvote_question_title ?? null;
  const upvoteCount = reportData?.answer_most_upvote_cnt ?? null;
  const thousandUpvoteAnswers = reportData?.answer_lk_upvote_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        你在「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{questionTitle ?? 'answer_most_upvote_question_title'}</span>」问题下的回答,被<span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')} px-[2px]`}>{upvoteCount ?? 'answer_most_upvote_cnt'}</span> 次赞同点亮,那是一次真实地被看见
      </div>

      <div className="pt-[60px] pb-[20px]">
        这一年,你还迎来了 <span className={`${colorClass('fern', 'font-bold')} ${typographyClass('highlight')} px-[2px]`}>{thousandUpvoteAnswers ?? 'answer_lk_upvote_cnt'}</span> 条千赞时刻
      </div>
    </BaseScene>
  );
}

