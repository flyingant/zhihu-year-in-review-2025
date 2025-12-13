"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { formatDate } from "@/utils/common";

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
  const answerCount = (reportData?.publish_answer_cnt ?? null) as number | null;
  const articleCount = (reportData?.publish_article_cnt ?? null) as number | null;
  const topDomain1 = (reportData?.publish_max_domin_top1 ?? null) as number | null;
  const topDomain2 = (reportData?.publish_max_domin_top2 ?? null) as number | null;
  const topDomain3 = (reportData?.publish_max_domin_top3 ?? null) as number | null;
  const firstAnswerDate = formatDate((reportData?.first_answer_date ?? null) as string | null);
  const firstAnswerTitle = (reportData?.first_answer_question_title ?? null) as string | null;

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

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px', fontSize: '14px' }}>
        <div style={{ fontSize: '22px' }}>
          这一年，你依旧好奇
        </div>

        <div style={{ paddingTop: '46px', paddingBottom: '8px' }} hidden={!answerCount && !articleCount}>
          你写下了
          <span
            hidden={!answerCount}
            className={`text-r-fern`}
            style={{ paddingLeft: '2px', paddingRight: '2px', fontSize: '18px' }}
          >
            {answerCount}
          </span>
          <span hidden={!answerCount}>个回答 <span hidden={!articleCount}>、</span></span>
          <span
            hidden={!articleCount}
            className={`text-r-pink`}
            style={{ paddingLeft: '2px', paddingRight: '2px', fontSize: '18px' }}
          >
            {articleCount}
          </span>
          <span hidden={!articleCount}> 篇文章。</span>

        </div>
        <div style={{ paddingBottom: '23px' }}>
          给这个世界一些答案
        </div>

        {/* 深耕领域 */}
        <div style={{ paddingBottom: '46px' }} hidden={!topDomain1 && !topDomain2 && !topDomain3}>
          <span
            hidden={!topDomain1}
            className={`text-r-blue`}
            style={{ paddingRight: '5px', fontSize: '18px' }}
          >
            {topDomain1}
          </span>
          <span hidden={!topDomain1 || !topDomain2}>、</span>
          <span
            hidden={!topDomain2}
            className={`text-r-blue`}
            style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '18px' }}
          >
            {topDomain2}
          </span>
          <span hidden={!topDomain2 || !topDomain3}>、</span>
          <span
            hidden={!topDomain3}
            className={`text-r-blue`}
            style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '18px' }}
          >
            {topDomain3}
          </span>
          是你耕耘最深的方向。
        </div>

        {/* 第一条回答 */}
        <div style={{ marginBottom: '4px' }} hidden={!firstAnswerDate && !firstAnswerTitle}>
          还记得吗？
          <span
            className={`text-r-green`}
            style={{ paddingLeft: '5px', fontSize: '18px' }}
          >
            {firstAnswerDate}
          </span>
        </div>
        <div className="leading-[36px]">
          你在，
          <span
            className={`text-r-fern`}
            style={{ marginLeft: '4px', marginRight: '4px', fontSize: '18px' }}
          >
            「{firstAnswerTitle}」
          </span>
          里写下了今年第一条回答。
        </div>
      </div>

    </BaseScene>
  );
}