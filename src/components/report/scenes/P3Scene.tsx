"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P3Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P3 spec
  const answerCount = reportData?.publish_answer_cnt ?? null;
  const articleCount = reportData?.publish_article_cnt ?? null;
  const topDomain1 = reportData?.publish_max_domin_top1 ?? null;
  const topDomain2 = reportData?.publish_max_domin_top2 ?? null;
  const topDomain3 = reportData?.publish_max_domin_top3 ?? null;
  const firstAnswerDate = reportData?.first_answer_date ?? null;
  const firstAnswerTitle = reportData?.first_answer_question_title ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title')}>
        你的答案,让混沌变得清晰
      </div>

      <div className="pt-[60px] pb-[20px]">
        你写下了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(answerCount ?? 'publish_answer_cnt')}</span> 个回答、
        <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(articleCount ?? 'publish_article_cnt')}</span> 篇文章。
      </div>
      <div className="pb-[23px]">
        给这个世界一些答案。
      </div>

      {/* 深耕领域 */}
      <div className="pb-[58px]">
        <span className={`${colorClass('blue')} ${typographyClass('subtitle')} pr-[5px]`}>{String(topDomain1 ?? 'publish_max_domin_top1')}</span>
        、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[5px]`}>{String(topDomain2 ?? 'publish_max_domin_top2')}</span>
        、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[5px]`}>{String(topDomain3 ?? 'publish_max_domin_top3')}</span>
        是你耕耘最深的方向。
      </div>

      {/* 第一条回答 */}
      <div className="mb-[14px]">
        还记得吗？ <span className={`${colorClass('green')} ${typographyClass('subtitle')} pl-[5px]`}>{String(firstAnswerDate ?? 'first_answer_date')}</span>
      </div>
      <div className="leading-[40px]">
        你在，
        <span className={`${colorClass('fern')} text-[16px] mx-[4px]`}>
          「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
        </span>
        里写下了今年第一条回答。
      </div>
    </BaseScene>
  );
}