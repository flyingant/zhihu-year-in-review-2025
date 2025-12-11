"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P23Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { review } = assets.report.p23;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P23 spec (特殊-答主评审团)
  const reviewAnswerCount = reportData?.review_answer_cnt ?? null;
  const reviewAnswerProductName =
    reportData?.review_answer_product_name ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt="{mix22_1.alt}"
          width={mix22_1.width}
          height={mix22_1.height}
          className="object-contain absolute top-[23px] left-0 pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_4.url}
          alt="{mix22_4.alt}"
          width={mix22_4.width}
          height={mix22_4.height}
          className="object-contain absolute top-[758px] right-0 pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute top-[208px] left-[316px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute top-[752px] left-[44px] pointer-events-none select-none z-1"
        />
      </GlitchLayer>
      {/* images */}
      <div className="z-0">
        <Image
          src={review.url}
          alt="{review.alt}"
          width={review.width}
          height={review.height}
          className="object-contain absolute top-[456px] left-0 pointer-events-none select-none -z-10"
        />
      </div>
      {/* content */}
      <div className="z-0">
        <div
          className={
            typographyClass("title") +
            " leading-relaxed absolute top-[116px] left-[41px]"
          }
        >
          你的判断,
          <br />
          构成了内容世界里的
          <br />
          那一份「真」
        </div>

        <div className="absolute top-[274px] left-[41px]">
          <div className="mb-[10px]">
            2025年,你在@答主评审团的测评中探寻了{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(reviewAnswerCount ?? "review_answer_cnt")}
            </span>{" "}
            次
          </div>
        </div>

        <div className="absolute top-[371px] left-[41px]">
          <div className="mb-[10px]">
            其中关于{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(reviewAnswerProductName ?? "review_answer_product_name")}
            </span>{" "}
            的测评,你用互动表达了对内容「真」的认可
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
