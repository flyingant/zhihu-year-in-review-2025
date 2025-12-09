"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P4Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const mix3Asset = bgAsset.mix3;
  const mix4Asset = bgAsset.mix4;
  const mix5Asset = bgAsset.mix5;

  const liukanshanAsset = assets.report.p2.liukanshan;
  const jiangtaiAsset = assets.report.p3.jiangtai;
  const caidaiAsset = assets.report.p4.caidai;



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
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute -top-[75px] left-[-8px] pointer-events-none select-none z-1" />
        <Image src={mix3Asset.url} alt="{mix3Asset.alt}" width={mix3Asset.width} height={mix3Asset.height} 
          className="object-contain absolute top-[35px] right-[0px] pointer-events-none select-none z-1" />
        <Image src={mix4Asset.url} alt="{mix4Asset.alt}" width={mix4Asset.width} height={mix4Asset.height} 
          className="object-contain absolute top-[339px] left-[0px] pointer-events-none select-none z-1" />
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute bottom-[267px] right-[150px] pointer-events-none select-none z-1" />
        <Image src={mix5Asset.url} alt="{mix5Asset.alt}" width={mix5Asset.width} height={mix5Asset.height} 
          className="object-contain absolute bottom-[22px] right-[88px] pointer-events-none select-none z-1" />
      </div>
      <div className="z-0">
        <Image 
          src={caidaiAsset.url} 
          alt={caidaiAsset.alt} 
          width={caidaiAsset.width} 
          height={caidaiAsset.height} 
          className="w-full object-contain absolute bottom-[202px] left-[0%]  pointer-events-none select-none z-1" 
        />
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute bottom-[85px] left-[12%]  pointer-events-none select-none z-1" 
        />
        <Image 
          src={jiangtaiAsset.url} 
          alt={jiangtaiAsset.alt} 
          width={jiangtaiAsset.width} 
          height={jiangtaiAsset.height} 
          className="object-contain absolute bottom-[47px] left-[7%] pointer-events-none select-none z-1" 
        />
      </div>
      <div className={typographyClass('title')}>
        这一年，你依旧好奇
      </div>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        你在「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{questionTitle}</span>」问题下的回答,被<span className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')} px-[2px]`}>{upvoteCount}</span> 次赞同点亮,那是一次真实地被看见
      </div>

      <div className="pt-[60px] pb-[20px]">
        这一年,你还迎来了 <span className={`${colorClass('fern', 'font-bold')} ${typographyClass('highlight')} px-[2px]`}>{thousandUpvoteAnswers}</span> 条千赞时刻
      </div>
    </BaseScene>
  );
}

