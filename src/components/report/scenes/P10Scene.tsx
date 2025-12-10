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

export default function P10Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const mix8Asset = bgAsset.mix8;
  const group1Asset = assets.report.p10.group1;
  const group2Asset = assets.report.p10.group2;
  const group3Asset = assets.report.p10.group3;
  const group4Asset = assets.report.p10.group4;
  const wordsAsset = assets.report.p10.words;

  
  const toNumberOrNull = (value: unknown): number | null =>
    typeof value === "number" ? value : null;

  // Map context data to component variables according to P10 spec (消费-基础数据)
  const articleCount = toNumberOrNull(reportData?.consume_article_cnt);
  const pinCount = toNumberOrNull(reportData?.consume_pin_cnt);
  const wordCount = toNumberOrNull(reportData?.consume_word_cnt);
  // Note: equivalentBook calculation is frontend logic based on wordCount

  // Calculate equivalent books (assuming ~200,000 words per book)
  const calculateEquivalentBooks = (words: number | null): number => {
    if (!words || words === 0) return 0;
    return Math.round(words / 200000);
  };

  const equivalentBooks = calculateEquivalentBooks(wordCount);

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className="pt-[60px] pb-[43px]">
        <ZhihuLogo />
      </div>
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={mix7Asset.url} alt="{mix7Asset.alt}" width={mix7Asset.width} height={mix7Asset.height} 
          className="object-contain absolute top-[40px] right-[0px] pointer-events-none select-none z-1" />
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute  top-[152px] left-[27px] pointer-events-none select-none z-1" />
        <Image src={mix8Asset.url} alt="{mix8Asset.alt}" width={mix8Asset.width} height={mix8Asset.height} 
          className="object-contain absolute bottom-[308px] left-[0px] pointer-events-none select-none z-1" />
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute bottom-[220px] right-[21px] pointer-events-none select-none z-1" />
        <Image src={mix9Asset.url} alt="{mix9Asset.alt}" width={mix9Asset.width} height={mix9Asset.height} 
          className="object-contain absolute bottom-[0] right-[6px] pointer-events-none select-none z-1" />
      </div>
      <div className={typographyClass('title') + ' leading-relaxed text-center pb-[24px]'}>
        你总共浏览了
      </div>
      <div className="">
        <div className="mb-[10px] relative h-[127px]">
          <Image src={group1Asset.url} alt="{group1Asset.alt}" width={group1Asset.width} height={group1Asset.height} 
            className="object-contain absolute right-[14px] pointer-events-none select-none z-1" />
          <div className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px] absolute top-[40px] right-[14px] z-2`}>{String(articleCount ?? 'consume_article_cnt')}</div>
        </div>
        <div className="mb-[10px] relative h-[127px] -top-[50px]">
          <Image src={group2Asset.url} alt="{group2Asset.alt}" width={group2Asset.width} height={group2Asset.height} 
            className="object-contain absolute left-[14px] pointer-events-none select-none z-1" />
          <div className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px] absolute top-[40px] left-[14px] z-2`}>{String(articleCount ?? 'consume_article_cnt')}</div>
        </div>
        <div className="mb-[10px] relative h-[127px] -top-[100px]">
          <Image src={group3Asset.url} alt="{group3Asset.alt}" width={group3Asset.width} height={group3Asset.height} 
            className="object-contain absolute right-[30px] pointer-events-none select-none z-1" />
          <div className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px] absolute top-[40px] right-[30px] z-2`}>{String(articleCount ?? 'consume_article_cnt')}</div>
        </div>
        <div className="mb-[10px] relative -top-[150px]">
          <Image src={group4Asset.url} alt="{group4Asset.alt}" width={group4Asset.width} height={group4Asset.height} 
            className="object-contain absolute left-[87px] pointer-events-none select-none z-1" />
          <div className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px] absolute top-[40px] left-[87px] z-2`}>{String(articleCount ?? 'consume_article_cnt')}</div>
        </div>
      </div>

      {/* 总计阅读字数 */}
      <div className="pt-[20px] pb-[20px] flex flex-col items-center justify-center">
        <Image src={wordsAsset.url} alt="{wordsAsset.alt}" width={wordsAsset.width} height={wordsAsset.height} 
          className="object-contain pointer-events-none select-none z-1 pb-[20px]" />
        <div>
          相当于读完 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{equivalentBooks}</span> 本书
        </div>
      </div>
    </BaseScene>
  );
}

