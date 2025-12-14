"use client";
import Image from "next/image";
import { useUserReportData } from "@/context/user-report-data-context";
import { typographyClass } from "@/hooks/useSceneTheme";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P2Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const blue2Asset = bgAsset.blue2;
  const green1Asset = bgAsset.green1;
  const mix1Asset = bgAsset.mix1;
  const mix2Asset = bgAsset.mix2;

  const p2Assets = assets.report.p2;
  const liukanshanAsset = p2Assets.liukanshan;
  const blueBallAsset = p2Assets.blueBall;
  const yellowBallAsset = p2Assets.yellowBall;

  // Map context data to component variables according to P2 spec
  const questionCount = (reportData?.publish_question_cnt ?? null) as number | null;
  const answerCount = (reportData?.question_answer_comment_cnt ?? null) as number | null;
  const domainCount = (reportData?.publish_domain_cnt ?? null) as number | null;
  const topDomain = (reportData?.publish_domain_name ?? null) as string | null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 标题右侧蓝色小块 */}
        <Image
          src={blue1Asset.url}
          alt={blue1Asset.alt}
          width={blue1Asset.width}
          height={blue1Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '20px', right: '36px' }}
        />
        {/* 标题左侧粉色/绿色小块 */}
        <Image
          src={mix2Asset.url}
          alt={mix2Asset.alt}
          width={mix2Asset.width}
          height={mix2Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', left: '0px' }}
        />
        {/* 中间左侧蓝色马赛克 */}
        <Image
          src={blue2Asset.url}
          alt={blue2Asset.alt}
          width={blue2Asset.width}
          height={blue2Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '231px', left: '26px' }}
        />
        {/* 左下角绿色故障树 */}
        <Image
          src={green1Asset.url}
          alt={green1Asset.alt}
          width={green1Asset.width}
          height={green1Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0%', left: '0px' }}
        />
        {/* 右下角红绿长条 */}
        <Image
          src={mix1Asset.url}
          alt={mix1Asset.alt}
          width={mix1Asset.width}
          height={mix1Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0%', right: '0px' }}
        />
      </GlitchLayer>

      <div className="z-0">
        <Image
          src={blueBallAsset.url}
          alt={blueBallAsset.alt}
          width={blueBallAsset.width}
          height={blueBallAsset.height}
          className="object-contain absolute pointer-events-none select-none z-1 animate-float"
          style={{ bottom: '212px', right: '74px' }}
        />
        <Image
          src={liukanshanAsset.url}
          alt={liukanshanAsset.alt}
          width={liukanshanAsset.width}
          height={liukanshanAsset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '31px', right: '55px' }}
        />
      </div>

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px', fontSize: '14px' }}>
        <div style={{ fontSize: '22px' }}>
          这一年，你依旧好奇
        </div>

        <div hidden={!questionCount} style={{ paddingTop: '60px', paddingBottom: '2px' }}>
          你向世界发出
          <span
            className="text-r-pink"
            style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '18px' }}
          >
            {questionCount}
          </span>
          次提问
        </div>

        <div hidden={!answerCount}>
          <span
            className={`text-r-fern`}
            style={{ paddingRight: '5px', fontSize: '18px' }}
          >
            {answerCount}
          </span>
          <span>条回答和评论让这些好奇有了回声</span>
        </div>

        <div className="relative" style={{ paddingTop: '30px' }} hidden={!domainCount}>
          <p style={{ paddingBottom: '12px' }}>
            你的好奇伸向
            <span
              className={`text-r-blue font-bold`}
              style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '18px' }}
            >
              {domainCount}
            </span>
            个领域
          </p>
          <p className="flex items-center">
            其中，
            <span
              className={`text-r-green`}
              style={{ paddingRight: '5px', fontSize: '18px' }}
            >
              {topDomain}
            </span>
            领域让你反复追问
          </p>
        </div>
      </div>
    </BaseScene>
  );
}