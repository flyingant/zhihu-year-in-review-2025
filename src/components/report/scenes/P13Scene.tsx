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

export default function P13Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const mix8Asset = bgAsset.mix8;
  const liukanshanAsset = assets.report.p13.liukanshan;

  // Map context data to component variables according to P13 spec
  // Note: P13 spec details to be confirmed, using placeholder structure
  // 字段是错误的，只是为了先完成结构 (保留你的注释)
  const mostProductiveDate = reportData?.publish_most_word_date ?? null;
  const dayWordCount = reportData?.publish_most_word_cnt ?? null;
  const firstAnswerTitle = reportData?.first_answer_question_title ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer className="z-0">
        {/* 顺序从上到下 */}
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '49px', left: '27px' }}
        />
        <Image 
          src={mix7Asset.url} 
          alt={mix7Asset.alt} 
          width={mix7Asset.width} 
          height={mix7Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '30px', right: '0px' }}
        />
        <Image 
          src={mix8Asset.url} 
          alt={mix8Asset.alt} 
          width={mix8Asset.width} 
          height={mix8Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '380px', left: '0px' }}
        />
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '90px', right: '35px' }}
        />
        <Image 
          src={mix9Asset.url} 
          alt={mix9Asset.alt} 
          width={mix9Asset.width} 
          height={mix9Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0px', left: '-50px' }}
        />
      </GlitchLayer>

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div className={typographyClass('title') + ' leading-relaxed'}>
          <div>在你忘我时流淌而过的 </div>
          <div>是放满收获的心流</div>
        </div>

        <div style={{ paddingBottom: '10px' }}>
          <div style={{ marginBottom: '6px' }}>
            <span 
              className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
              style={{ paddingRight: '5px' }}
            >
              {mostProductiveDate ?? 'publish_most_word_date'}
            </span> 
            日，你在知乎停留了最长的 
            <span 
              className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
              style={{ paddingLeft: '2px', paddingRight: '2px' }}
            >
              {dayWordCount ?? 'publish_most_word_cnt'}
            </span> 
            分钟
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
          />
        </div>

        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div style={{ lineHeight: '40px' }}>
            <span 
              className={`${colorClass('fern')}`}
              style={{ fontSize: '16px', marginLeft: '4px', marginRight: '4px' }}
            >
              「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
            </span>
            问题下的回答，你反复阅读了 
            <span 
              className={`${colorClass('blue')} ${typographyClass('subtitle')}`}
              style={{ paddingLeft: '2px', paddingRight: '2px' }}
            >
              {dayWordCount ?? 'publish_most_word_cnt'}
            </span> 
            次
            <div>那是你心底的珍藏吗？</div>
          </div>
        </div>
      </div>   
    </BaseScene>
  );
}