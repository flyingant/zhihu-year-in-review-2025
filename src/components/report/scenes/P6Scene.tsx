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

export default function P6Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const green1Asset = bgAsset.green1;
  const mix1Asset = bgAsset.mix1;
  const mix2Asset = bgAsset.mix2;
  const liukanshanAsset = assets.report.p6.liukanshan;
  
  // Map context data to component variables according to P6 spec
  const totalWords = reportData?.content_total_word_cnt ?? null;
  const creationDays = reportData?.publish_total_day_cnt ?? null;
  const mostProductiveMonth = reportData?.publish_max_month ?? null;
  const mostProductiveDate = reportData?.publish_most_word_date ?? null;
  const dayWordCount = reportData?.publish_most_word_cnt ?? null;
  // Note: equivalentBook calculation is frontend logic based on totalWords

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
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute bottom-[194px] right-[74px] pointer-events-none select-none z-1" />
        <Image src={green1Asset.url} alt="{green1Asset.alt}" width={green1Asset.width} height={green1Asset.height} 
          className="object-contain absolute bottom-[0%] left-[0px] pointer-events-none select-none z-1" />
        <Image src={mix1Asset.url} alt="{mix1Asset.alt}" width={mix1Asset.width} height={mix1Asset.height} 
          className="object-contain absolute bottom-[0%] right-[0px] pointer-events-none select-none z-1" />
      </div>
      <div className="px-[34px]">
        <div className={typographyClass('title') + ' mb-[40px]'}>
        这一年，你真心分享
        </div>

        {/* 总字数 */}
        <div className="mb-[40px] leading-[32px]">
          你在知乎写下了 <span className={`${colorClass('pink')} ${typographyClass('highlight')} pr-[4px]`}>{totalWords ?? 'content_total_word_cnt'}</span> 个字
        </div>

        {/* 创作天数 */}
        <div className="mb-[30px]">
          足以拼成 <span className={`${colorClass('fern')} ${typographyClass('highlight')} px-[4px]`}>{creationDays ?? 'publish_total_day_cnt'}</span> 本
          <span className={`${colorClass('fern')} ${typographyClass('highlight')} px-[4px]`}>{creationDays ?? 'publish_total_day_cnt'}</span> 
        </div>

        <div className="z-0 flex items-center w-[153px] ml-[-34px]">
          <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
            className="object-contain pointer-events-none select-none z-1" 
          />
          <div>
            <div>
              在 <span className={`${colorClass('fern')} ${typographyClass('highlight')} px-[4px]`}>{creationDays ?? 'publish_total_day_cnt'}</span> 天里
            </div>
            <div>
              你都勇敢表达、留下印记
            </div>
          </div>
        </div>

        {/* 最高产月份 */}
        <div className="pb-[30px]">
          <div className="mb-[6px]">
            <span className={`${colorClass('pink')} ${typographyClass('subtitle')} pr-[2px]`}>{mostProductiveMonth ?? 'publish_max_month'}</span> 月是你的灵感高峰
          </div>
        </div>

        {/* 文思泉涌的一天 */}
        <div className="pb-[60px]">
          <div className="mb-[6px]">
            <span className={`${colorClass('blue')} ${typographyClass('subtitle')} pr-[5px]`}>{mostProductiveDate ?? 'publish_most_word_date'}</span> 日，你写下了今年最多的 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{dayWordCount ?? 'publish_most_word_cnt'}</span> 字
          </div>
        </div>
      </div> 
    </BaseScene>
  );
}