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

  const toStringOrFallback = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;

  const toNumberOrFallback = (value: unknown, fallback: string) =>
    typeof value === "number" ? value : fallback;

  // Map context data to component variables according to P4 spec
  const questionTitle = toStringOrFallback(reportData?.answer_most_upvote_question_title, 'answer_most_upvote_question_title');
  const upvoteCount = toNumberOrFallback(reportData?.answer_most_upvote_cnt, 'answer_most_upvote_cnt');
  const thousandUpvoteAnswers = toNumberOrFallback(reportData?.answer_lk_upvote_cnt, 'answer_lk_upvote_cnt');

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        你在「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{questionTitle}</span>」问题下的回答,被<span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')} px-[2px]`}>{upvoteCount}</span> 次赞同点亮,那是一次真实地被看见
      </div>

      <div className="pt-[60px] pb-[20px]">
        这一年,你还迎来了 <span className={`${colorClass('fern', 'font-bold')} ${typographyClass('highlight')} px-[2px]`}>{thousandUpvoteAnswers}</span> 条千赞时刻
      </div>
    </BaseScene>
  );
}

