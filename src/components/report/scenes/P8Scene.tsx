"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P8Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P8 spec
  const zhiTrendRankCount = reportData?.zhishi_cnt ?? null;
  const influenceRankCount = reportData?.biz_list_num ?? null;
  const bestAnswerTopic = reportData?.best_answer_topic ?? null;
  const isNavigator = reportData?.is_navigator ?? null;
  const navigatorContentCount = reportData?.navigator_upvote_content_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('highlight') + ' leading-[1.4] mb-[140px]'}>
        这一路，作品为你点亮星光
      </div>

      <div className="text-[15px] leading-[34px]">
        <div>
          你登上了 <span className={`${colorClass('blue')} text-[20px] pr-[4px]`}>{zhiTrendRankCount ?? 'zhishi_cnt'}</span> 次知势榜
        </div>
        <div>
          上榜知乎答主商业影响力榜 <span className={`${colorClass('fern')} text-[20px] pr-[4px]`}>{influenceRankCount ?? 'biz_list_num'}</span> 次
        </div>
        <div>
          成为了 <span className={`${colorClass('pink')} text-[20px] px-[4px]`}>{bestAnswerTopic ?? 'best_answer_topic'}</span> 话题下的优秀答主
        </div>
        <div className="leading-[26px] mt-[8px]">
          你成为了航海家，用航海家赞同发现和助力了 <span className={`${colorClass('blue')} text-[20px] px-[4px]`}>{navigatorContentCount ?? 'navigator_upvote_content_cnt'}</span> 篇好内容
        </div>
      </div>
    </BaseScene>
  );
}