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

export default function P13Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const mix8Asset = bgAsset.mix8;
  const liukanshanAsset = assets.report.p13.liukanshan;

  
  // Map context data to component variables according to P13 spec
  // Note: P13 spec details to be confirmed, using placeholder structure
  // 字段是错误的，只是为了先完成结构
  const placeholder = reportData?.placeholder ?? null;
  const totalWords = reportData?.content_total_word_cnt ?? null;
  const creationDays = reportData?.publish_total_day_cnt ?? null;
  const mostProductiveMonth = reportData?.publish_max_month ?? null;
  const mostProductiveDate = reportData?.publish_most_word_date ?? null;
  const dayWordCount = reportData?.publish_most_word_cnt ?? null;
  const firstAnswerTitle = reportData?.first_answer_question_title ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className="pt-[60px] pb-[43px]">
        <ZhihuLogo />
      </div>
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute top-[49px] left-[27px] pointer-events-none select-none z-1" />
        <Image src={mix7Asset.url} alt="{mix7Asset.alt}" width={mix7Asset.width} height={mix7Asset.height} 
          className="object-contain absolute top-[30px] right-[0px] pointer-events-none select-none z-1" />
        <Image src={mix8Asset.url} alt="{mix8Asset.alt}" width={mix8Asset.width} height={mix8Asset.height} 
          className="object-contain absolute bottom-[380px] left-[0px] pointer-events-none select-none z-1" />
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute bottom-[90px] right-[35px] pointer-events-none select-none z-1" />
        <Image src={mix9Asset.url} alt="{mix9Asset.alt}" width={mix9Asset.width} height={mix9Asset.height} 
          className="object-contain absolute bottom-[0] left-[-50px] pointer-events-none select-none z-1" />
      </div>
      <div className="px-[34px]">
        <div className={typographyClass('title') + ' leading-relaxed'}>
          <div>在你忘我时流淌而过的 </div>
          <div>是放满收获的心流</div>
        </div>
        <div className="pb-[10px]">
          <div className="mb-[6px]">
            <span className={`${colorClass('blue')} ${typographyClass('subtitle')} pr-[5px]`}>{mostProductiveDate ?? 'publish_most_word_date'}</span> 日，你在知乎停留了最长的 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{dayWordCount ?? 'publish_most_word_cnt'}</span> 分钟
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Image src={liukanshanAsset.url} alt={liukanshanAsset.alt} width={liukanshanAsset.width} height={liukanshanAsset.height} />
        </div>
        <div className="pt-[20px] pb-[20px]">
          <div className="leading-[40px]">
            <span className={`${colorClass('fern')} text-[16px] mx-[4px]`}>
              「{String(firstAnswerTitle ?? 'first_answer_question_title')}」
            </span>
            问题下的回答，你反复阅读了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{dayWordCount ?? 'publish_most_word_cnt'}</span> 次
            <div>那是你心底的珍藏吗？</div>
          </div>
        </div>
      </div>   
    </BaseScene>
  );
}

