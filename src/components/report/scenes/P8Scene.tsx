"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import ZhihuLogo from "../../ui/ZhihuLogo";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P8Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const liukanshanAsset = assets.report.p8.liukanshan;
  const sparkleAsset = assets.report.p8.sparkle;
  const shipAsset = assets.report.p8.ship;
  
  
  // Map context data to component variables according to P8 spec
  const zhiTrendRankCount = reportData?.zhishi_cnt ?? null;
  const influenceRankCount = reportData?.biz_list_num ?? null;
  const bestAnswerTopic = reportData?.best_answer_topic ?? null;
  const isNavigator = reportData?.is_navigator ?? null;
  const navigatorContentCount = reportData?.navigator_upvote_content_cnt ?? null;
  const firstAnswerTitle = reportData?.first_answer_question_title ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className="pt-[60px] pb-[43px]">
        <ZhihuLogo />
      </div>
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute top-[20px] right-[36px] pointer-events-none select-none z-1" />
        <Image src={mix2Asset.url} alt="{mix2Asset.alt}" width={mix2Asset.width} height={mix2Asset.height} 
          className="object-contain absolute top-[152px] left-[0px] pointer-events-none select-none z-1" />
        <Image src={mix5Asset.url} alt="{mix5Asset.alt}" width={mix5Asset.width} height={mix5Asset.height} 
          className="object-contain absolute bottom-[20] right-[74px] pointer-events-none select-none z-1" />
      </div>
      <div className="px-[34px]">
        <div className={typographyClass('highlight') + ' leading-[1.4] mb-[68px]'}>
          这一年，你荣登榜首
        </div>

        <div>
          你登上了 <span className={`${colorClass('blue')} text-[20px] pr-[4px]`}>{zhiTrendRankCount ?? 'zhishi_cnt'}</span> 次知势榜
        </div>
        <div>
          上榜知乎答主商业影响力榜 <span className={`${colorClass('fern')} text-[20px] pr-[4px]`}>{influenceRankCount ?? 'biz_list_num'}</span> 次
        </div>
        <div className="leading-[40px]">
          在
          <span className={`${colorClass('fern')} text-[16px] mx-[4px]`}>
            「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
          </span>
          话题下成为优秀答主
        </div>
        <div className="relative pt-[50px] pl-[140px]">
          <Image src={sparkleAsset.url} alt="{sparkleAsset.alt}" width={sparkleAsset.width} height={sparkleAsset.height} 
            className="object-contain absolute top-[10px] left-[90px] pointer-events-none select-none z-1" />
          <Image src={liukanshanAsset.url} alt="{liukanshanAsset.alt}" width={liukanshanAsset.width} height={liukanshanAsset.height} 
            className="object-contain relative pointer-events-none select-none z-10" />
        </div>
        <div className="flex">
          <div className="leading-[26px] mt-[8px]">
            你成为了航海家，用航海家赞同发现和助力了 <span className={`${colorClass('blue')} text-[20px] px-[4px]`}>{navigatorContentCount ?? 'navigator_upvote_content_cnt'}</span> 篇好内容
          </div>
          <Image src={shipAsset.url} alt="{shipAsset.alt}" width={shipAsset.width} height={shipAsset.height} 
            className="object-contain pointer-events-none select-none z-1" />
        </div>
      </div>
    </BaseScene>
  );
}