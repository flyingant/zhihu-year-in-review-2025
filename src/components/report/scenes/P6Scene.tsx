"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P6Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P6 spec
  const totalWords = reportData?.content_total_word_cnt ?? null;
  const creationDays = reportData?.publish_total_day_cnt ?? null;
  const mostProductiveMonth = reportData?.publish_max_month ?? null;
  const mostProductiveDate = reportData?.publish_most_word_date ?? null;
  const dayWordCount = reportData?.publish_most_word_cnt ?? null;
  // Note: equivalentBook calculation is frontend logic based on totalWords

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' mb-[40px]'}>
        真实的表达，写满了自己
      </div>

      {/* 总字数 */}
      <div className="mb-[40px] leading-[32px]">
        你在知乎写下了 <span className={`${colorClass('fern')} ${typographyClass('highlight')} pr-[4px]`}>{totalWords ?? 'content_total_word_cnt'}</span> 个字
        {/* Note: equivalentBook calculation should be done in frontend based on totalWords */}
      </div>

      {/* 创作天数 */}
      <div className="mb-[30px]">
        今年，你有 <span className={`${colorClass('blue')} ${typographyClass('highlight')} px-[4px]`}>{creationDays ?? 'publish_total_day_cnt'}</span> 天发布了内容
      </div>

      {/* 最高产月份 */}
      <div className="pb-[30px]">
        <div className="mb-[6px]">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} pr-[2px]`}>{mostProductiveMonth ?? 'publish_max_month'}</span> 月是你的灵感高峰
        </div>
        <div className="text-gray-500 text-[12px]">
          是你灵感旺盛，表达最多的月份
        </div>
      </div>

      {/* 文思泉涌的一天 */}
      <div className="pb-[60px]">
        <div className="mb-[6px]">
          <span className={`${colorClass('blue')} ${typographyClass('subtitle')} pr-[5px]`}>{mostProductiveDate ?? 'publish_most_word_date'}</span> 是你文思泉涌的一天，你在知乎写下共 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{dayWordCount ?? 'publish_most_word_cnt'}</span> 字
        </div>
        <div className="text-gray-500 text-[12px]">
          是你思如泉涌，妙笔生花的时间
        </div>
      </div>
    </BaseScene>
  );
}