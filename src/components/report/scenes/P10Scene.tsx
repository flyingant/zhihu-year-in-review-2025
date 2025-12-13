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

export default function P10Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
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

  // Map context data to component variables according to P10 spec
  const articleCount = toNumberOrNull(reportData?.consume_article_cnt);
  const pinCount = toNumberOrNull(reportData?.consume_pin_cnt);
  const wordCount = toNumberOrNull(reportData?.consume_word_cnt);

  // Calculate equivalent books
  const calculateEquivalentBooks = (words: number | null): number => {
    if (!words || words === 0) return 0;
    return Math.round(words / 200000);
  };

  const equivalentBooks = calculateEquivalentBooks(wordCount);

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image 
          src={mix7Asset.url} 
          alt={mix7Asset.alt} 
          width={mix7Asset.width} 
          height={mix7Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '40px', right: '0px' }}
        />
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', left: '27px' }}
        />
        <Image 
          src={mix8Asset.url} 
          alt={mix8Asset.alt} 
          width={mix8Asset.width} 
          height={mix8Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '308px', left: '0px' }}
        />
        <Image 
          src={blue10Asset.url} 
          alt={blue10Asset.alt} 
          width={blue10Asset.width} 
          height={blue10Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '220px', right: '21px' }}
        />
        <Image 
          src={mix9Asset.url} 
          alt={mix9Asset.alt} 
          width={mix9Asset.width} 
          height={mix9Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0px', right: '6px' }}
        />
      </GlitchLayer>

      <div 
        className={typographyClass('title') + ' leading-relaxed text-center'}
        style={{ paddingTop: '120px', paddingBottom: '24px' }}
      >
        你总共浏览了
      </div>

      <div>
        {/* Group 1: 文章数 */}
        <div className="relative" style={{ height: '127px', marginBottom: '10px' }}>
          <Image 
            src={group1Asset.url} 
            alt={group1Asset.alt} 
            width={group1Asset.width} 
            height={group1Asset.height} 
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ right: '24px' }}
          />
          <div 
            className={`${colorClass('pink')} ${typographyClass('subtitle')} absolute z-2`}
            style={{ top: '40px', right: '24px', paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(articleCount ?? 'consume_article_cnt')}
          </div>
        </div>

        {/* Group 2: 想法数 (这里使用了 pinCount) */}
        <div className="relative" style={{ height: '127px', marginBottom: '10px', top: '-50px' }}>
          <Image 
            src={group2Asset.url} 
            alt={group2Asset.alt} 
            width={group2Asset.width} 
            height={group2Asset.height} 
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ left: '24px' }}
          />
          <div 
            className={`${colorClass('pink')} ${typographyClass('subtitle')} absolute z-2`}
            style={{ top: '40px', left: '24px', paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(pinCount ?? 'consume_pin_cnt')}
          </div>
        </div>

        {/* Group 3: 总字数 (这里使用了 wordCount) */}
        <div className="relative" style={{ height: '127px', marginBottom: '10px', top: '-100px' }}>
          <Image 
            src={group3Asset.url} 
            alt={group3Asset.alt} 
            width={group3Asset.width} 
            height={group3Asset.height} 
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ right: '40px' }}
          />
          <div 
            className={`${colorClass('pink')} ${typographyClass('subtitle')} absolute z-2`}
            style={{ top: '40px', right: '40px', paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(wordCount ?? 'consume_word_cnt')}
          </div>
        </div>

        {/* Group 4: 其他数据 (这里暂时重复使用 articleCount，根据需求修改) */}
        <div className="relative" style={{ height: '127px', marginBottom: '10px', top: '-150px' }}>
          <Image 
            src={group4Asset.url} 
            alt={group4Asset.alt} 
            width={group4Asset.width} 
            height={group4Asset.height} 
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ left: '87px' }}
          />
          <div 
            className={`${colorClass('pink')} ${typographyClass('subtitle')} absolute z-2`}
            style={{ top: '40px', left: '87px', paddingLeft: '2px', paddingRight: '2px' }}
          >
            {String(articleCount ?? 'consume_article_cnt')}
          </div>
        </div>
      </div>

      {/* 总计阅读字数 / 等效书本 */}
      <div 
        className="flex flex-col items-center justify-center"
        style={{ paddingTop: '20px', paddingBottom: '20px', marginTop: '-150px' }} // 上面用了 top: -150px，这里加个 marginTop 抵消视觉空白
      >
        <Image 
          src={wordsAsset.url} 
          alt={wordsAsset.alt} 
          width={wordsAsset.width} 
          height={wordsAsset.height} 
          className="object-contain pointer-events-none select-none z-1"
          style={{ marginBottom: '20px' }}
        />
        <div>
          相当于读完 
          <span 
            className={`${colorClass('pink')} ${typographyClass('subtitle')}`}
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            {equivalentBooks}
          </span> 
          本书
        </div>
      </div>
    </BaseScene>
  );
}