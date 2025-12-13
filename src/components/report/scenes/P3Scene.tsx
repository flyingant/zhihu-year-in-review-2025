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

export default function P3Scene({ onNext, sceneName }: PageProps) {
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
          style={{ top: '319px', left: '0px' }}
        />
        <Image 
          src={blue1Asset.url} 
          alt={blue1Asset.alt} 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '267px', right: '56px' }}
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
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1 animate-jump-steps"
          style={{ bottom: '48px', left: '-20px' }}
        />
        <Image 
          src={jiangtaiAsset.url} 
          alt={jiangtaiAsset.alt} 
          width={jiangtaiAsset.width} 
          height={jiangtaiAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '48px', left: '27px' }}
        />
      </div>

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div className={typographyClass('title')}>
          这一年，你依旧好奇
        </div>

        <div style={{ paddingTop: '60px', paddingBottom: '20px' }}>
          你写下了 
          <span 
            className={`${colorClass('fern')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(answerCount ?? 'publish_answer_cnt')}
          </span> 
          个回答、
          <span 
            className={`${colorClass('pink')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(articleCount ?? 'publish_article_cnt')}
          </span> 
          篇文章。
        </div>
        <div style={{ paddingBottom: '23px' }}>
          给这个世界一些答案。
        </div>

        {/* 深耕领域 */}
        <div style={{ paddingBottom: '58px' }}>
          <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingRight: '5px' }}
          >
            {String(topDomain1 ?? 'publish_max_domin_top1')}
          </span>
          、
          <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '5px', paddingRight: '5px' }}
          >
            {String(topDomain2 ?? 'publish_max_domin_top2')}
          </span>
          、
          <span 
            className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '5px', paddingRight: '5px' }}
          >
            {String(topDomain3 ?? 'publish_max_domin_top3')}
          </span>
          是你耕耘最深的方向。
        </div>

        {/* 第一条回答 */}
        <div style={{ marginBottom: '14px' }}>
          还记得吗？ 
          <span 
            className={`${colorClass('green')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '5px' }}
          >
            {String(firstAnswerDate ?? 'first_answer_date')}
          </span>
        </div>
        <div className="leading-[40px]">
          你在，
          <span 
            className={`${colorClass('fern')} text-[16px]`}
            style={{ marginLeft: '4px', marginRight: '4px' }}
          >
            「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
          </span>
          里写下了今年第一条回答。
        </div>
      </div>
      
    </BaseScene>
  );
}