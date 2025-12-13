"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

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
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image 
          src={blue2Asset.url} 
          alt={blue2Asset.alt} 
          width={blue2Asset.width} 
          height={blue2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '45px', left: '-8px' }}
        />
        <Image 
          src={mix3Asset.url} 
          alt={mix3Asset.alt} 
          width={mix3Asset.width} 
          height={mix3Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', right: '0px' }}
        />
        <Image 
          src={mix4Asset.url} 
          alt={mix4Asset.alt} 
          width={mix4Asset.width} 
          height={mix4Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '339px', left: '0px' }}
        />
        <Image 
          src={blue1Asset.url} 
          alt={blue1Asset.alt} 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '267px', right: '150px' }}
        />
        <Image 
          src={mix5Asset.url} 
          alt={mix5Asset.alt} 
          width={mix5Asset.width} 
          height={mix5Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '22px', right: '88px' }}
        />
      </GlitchLayer>
      
      <div className="z-0">
        <Image 
          src={caidaiAsset.url} 
          alt={caidaiAsset.alt} 
          width={caidaiAsset.width} 
          height={caidaiAsset.height} 
          className="w-full object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '202px', left: '0%' }}
        />
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '85px', left: '12%' }}
        />
        <Image 
          src={jiangtaiAsset.url} 
          alt={jiangtaiAsset.alt} 
          width={jiangtaiAsset.width} 
          height={jiangtaiAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '47px', left: '7%' }}
        />
      </div>
      
      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div className={typographyClass('title')}>
          这一年，你依旧好奇
        </div>
        <div className={typographyClass('title') + ' leading-relaxed'}>
          你在「
          <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {questionTitle}
          </span>
          」问题下的回答,被
          <span 
            className={`${colorClass('pink', 'font-bold')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {upvoteCount}
          </span> 
          次赞同点亮,那是一次真实地被看见
        </div>

        <div style={{ paddingTop: '60px', paddingBottom: '20px' }}>
          这一年,你还迎来了 
          <span 
            className={`${colorClass('fern', 'font-bold')} ${typographyClass('highlight')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {thousandUpvoteAnswers}
          </span> 
          条千赞时刻
        </div>
      </div>
      
    </BaseScene>
  );
}