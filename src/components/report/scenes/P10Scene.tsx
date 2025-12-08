"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P10Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  const toNumberOrNull = (value: unknown): number | null =>
    typeof value === "number" ? value : null;

  // Map context data to component variables according to P10 spec (消费-基础数据)
  const articleCount = toNumberOrNull(reportData?.consume_article_cnt);
  const pinCount = toNumberOrNull(reportData?.consume_pin_cnt);
  const wordCount = toNumberOrNull(reportData?.consume_word_cnt);
  // Note: equivalentBook calculation is frontend logic based on wordCount

  // Calculate equivalent books (assuming ~200,000 words per book)
  const calculateEquivalentBooks = (words: number | null): number => {
    if (!words || words === 0) return 0;
    return Math.round(words / 200000);
  };

  const equivalentBooks = calculateEquivalentBooks(wordCount);

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        消费-基础数据
      </div>

      <div className="pt-[60px] pb-[20px]">
        <div className="mb-[10px]">
          <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(articleCount ?? 'consume_article_cnt')}</span> 篇文章
        </div>
        <div className="mb-[10px]">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(pinCount ?? 'consume_pin_cnt')}</span> 条想法
        </div>
      </div>

      {/* 总计阅读字数 */}
      <div className="pt-[40px] pb-[20px]">
        <div className="mb-[10px]">
          总计阅读 <span className={`${colorClass('fern')} ${typographyClass('highlight')} px-[4px]`}>{String(wordCount ?? 'consume_word_cnt')}</span> 个字
        </div>
        <div>
          相当于读完 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{equivalentBooks}</span> 本书
        </div>
      </div>
    </BaseScene>
  );
}

