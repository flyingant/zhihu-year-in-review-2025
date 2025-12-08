"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P23Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P23 spec (特殊-答主评审团)
  const reviewAnswerCount = reportData?.review_answer_cnt ?? null;
  const reviewAnswerProductName = reportData?.review_answer_product_name ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        你的判断,构成了内容世界里的那一份「真」
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          2025年,你在@答主评审团的测评中探寻了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(reviewAnswerCount ?? 'review_answer_cnt')}</span> 次
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          其中关于 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(reviewAnswerProductName ?? 'review_answer_product_name')}</span> 的测评,你用互动表达了对内容「真」的认可
        </div>
      </div>
    </BaseScene>
  );
}

