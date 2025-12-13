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
  const bestAnswerTopic = reportData?.best_answer_topic ?? null; // Note: Not used in original JSX, assuming firstAnswerTitle was intended or specific logic needed
  const isNavigator = reportData?.is_navigator ?? null;
  const navigatorContentCount = reportData?.navigator_upvote_content_cnt ?? null;
  const firstAnswerTitle = reportData?.first_answer_question_title ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image 
          src={blue1Asset.url} 
          alt={blue1Asset.alt} 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '20px', right: '36px' }}
        />
        <Image 
          src={mix2Asset.url} 
          alt={mix2Asset.alt} 
          width={mix2Asset.width} 
          height={mix2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', left: '0px' }}
        />
        <Image 
          src={mix5Asset.url} 
          alt={mix5Asset.alt} 
          width={mix5Asset.width} 
          height={mix5Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '20px', right: '74px' }}
        />
      </GlitchLayer>

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div 
          className={typographyClass('highlight')} 
          style={{ lineHeight: '1.4', marginBottom: '68px' }}
        >
          这一年，你荣登榜首
        </div>

        <div>
          你登上了 
          <span 
            className={`${colorClass('blue')}`}
            style={{ fontSize: '20px', paddingRight: '4px' }}
          >
            {zhiTrendRankCount ?? 'zhishi_cnt'}
          </span> 
          次知势榜
        </div>
        
        <div>
          上榜知乎答主商业影响力榜 
          <span 
            className={`${colorClass('fern')}`}
            style={{ fontSize: '20px', paddingRight: '4px' }}
          >
            {influenceRankCount ?? 'biz_list_num'}
          </span> 
          次
        </div>

        <div style={{ lineHeight: '40px' }}>
          在
          <span 
            className={`${colorClass('fern')} text-[16px]`}
            style={{ marginLeft: '4px', marginRight: '4px' }}
          >
            「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
          </span>
          话题下成为优秀答主
        </div>

        {/* 奖杯和刘看山区域 */}
        <div style={{ position: 'relative', paddingTop: '50px', paddingLeft: '140px' }}>
          <Image 
            src={sparkleAsset.url} 
            alt={sparkleAsset.alt} 
            width={sparkleAsset.width} 
            height={sparkleAsset.height} 
            className="opacity-0 animate-pop-sparkle object-contain absolute pointer-events-none select-none z-1"
            style={{ top: '10px', left: '90px' }}
          />
          <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
            className="object-contain relative pointer-events-none select-none z-10" 
          />
        </div>

        {/* 航海家区域 - 从右侧滑入动画 */}
        <div 
          className="opacity-0 animate-slide-in-right" 
          style={{ 
            animationDelay: '0.5s', 
            display: 'flex',
            marginTop: '0px' // 这里原代码没有 mt，如果需要间距可以添加
          }}
        >
          <div style={{ lineHeight: '26px', marginTop: '8px' }}>
            你成为了航海家，用航海家赞同发现和助力了 
            <span 
              className={`${colorClass('blue')}`}
              style={{ fontSize: '20px', paddingLeft: '4px', paddingRight: '4px' }}
            >
              {navigatorContentCount ?? 'navigator_upvote_content_cnt'}
            </span> 
            篇好内容
          </div>
          <Image 
            src={shipAsset.url} 
            alt={shipAsset.alt} 
            width={shipAsset.width} 
            height={shipAsset.height} 
            className="object-contain pointer-events-none select-none z-1" 
          />
        </div>
      </div>
    </BaseScene>
  );
}