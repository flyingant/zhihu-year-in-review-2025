"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P2Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P2 spec
  const questionCount = reportData?.publish_question_cnt ?? null;
  const answerCount = reportData?.question_answer_comment_cnt ?? null;
  const domainCount = reportData?.publish_domain_cnt ?? null;
  const topDomain = reportData?.publish_domain_name ?? null;
  const billboardCount = reportData?.billboard_question_cnt ?? null;
  const billboardDate = reportData?.billboard_question_date ?? null;
  const billboardTitle = reportData?.billboard_question_title ?? null;
  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName} contentClassName="pl-[34px]">
      <div className={typographyClass('title') + ' leading-relaxed'}>
        你的好奇,擦亮了世界的雾面
      </div>
      <div className="pt-[60px] pb-[14px]">
        你向世界发出 <span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')} px-[5px]`}>{questionCount ?? 'publish_question_cnt'}</span> 次提问
      </div>

      <div className="pt-[60px] pb-[14px]">
        <span className={`${typographyClass('highlight')} ${colorClass('fern')} font-bold pr-[5px]`}>{answerCount ?? 'question_answer_comment_cnt'}</span>
        <p className="mt-2">条回答和评论让这些好奇有了回声</p>
      </div>

      <div className="text-sm pt-[33px]">
        <p className='pb-[12px]'>你的好奇伸向 <span className={`${colorClass('blue', 'font-bold')} ${typographyClass('subtitle')} px-[5px]`}>{String(domainCount ?? 'publish_domain_cnt')}</span> 个领域</p>
        <p className="flex items-center">
          其中，<span className={`${colorClass('green')} ${typographyClass('subtitle')} font-bold pr-[5px]`}>{String(topDomain ?? 'publish_domain_name')}</span> 领域让你反复追问
        </p>
      </div>

      {/* 热榜提问 */}
      <div className="text-sm pt-[20px]">
        <span className={`${colorClass('pink')} ${typographyClass('subtitle')} font-bold pr-[5px]`}>{String(billboardCount ?? 'billboard_question_cnt')}</span> 个提问脊上热榜
        <p className="pt-[8px] text-gray-500">
          其中 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(billboardTitle ?? 'billboard_question_title')}</span> 问题于 {String(billboardDate ?? 'billboard_question_date')}
        </p>
      </div>
    </BaseScene>
  );
}