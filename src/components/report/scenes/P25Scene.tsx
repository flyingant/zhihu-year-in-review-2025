"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P25Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P25 spec (特殊-故事会员/读者)
  const paidContentCount = reportData?.paid_content_cnt ?? null;
  const totalWordCount = reportData?.total_word_cnt ?? null;
  const labelName1 = reportData?.label_name_top1 ?? null;
  const labelName2 = reportData?.label_name_top2 ?? null;
  const labelName3 = reportData?.label_name_top3 ?? null;
  const mostFavoriteAuthorName = reportData?.most_favorite_author_name ?? null;
  const mostFavoriteAuthorNum = reportData?.most_favorite_author_num ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        虚构里,也藏着真实的脉动
      </div>

      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          2025年,作为尊贵的盐选会员你解锁了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(paidContentCount ?? 'paid_content_cnt')}</span> 篇盐言故事,共 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(totalWordCount ?? 'total_word_cnt')}</span> 字
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(labelName1 ?? 'label_name_top1')}</span>」 「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(labelName2 ?? 'label_name_top2')}</span>」 「<span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(labelName3 ?? 'label_name_top3')}</span>」是最打动你的故事元素
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          你阅读最多的作者是 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostFavoriteAuthorName ?? 'most_favorite_author_name')}</span> TA的 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(mostFavoriteAuthorNum ?? 'most_favorite_author_num')}</span> 篇故事,陪你度过了不少时光
        </div>
      </div>
    </BaseScene>
  );
}

