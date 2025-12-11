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

export default function P25Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, top, left, middle, right } = assets.report.p25;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P25 spec (特殊-故事会员/读者)
  const paidContentCount = reportData?.paid_content_cnt ?? null;
  const totalWordCount = reportData?.total_word_cnt ?? null;
  const labelName1 = reportData?.label_name_top1 ?? null;
  const labelName2 = reportData?.label_name_top2 ?? null;
  const labelName3 = reportData?.label_name_top3 ?? null;
  const mostFavoriteAuthorName = reportData?.most_favorite_author_name ?? null;
  const mostFavoriteAuthorNum = reportData?.most_favorite_author_num ?? null;

  return (
    <BaseScene defaultLogo={false} onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt="{mix22_1.alt}"
          width={mix22_1.width}
          height={mix22_1.height}
          className="object-contain absolute top-[344px] left-0 pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute top-[308px] left-[278px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute top-[605px] left-[83px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_4.url}
          alt="{mix22_4.alt}"
          width={mix22_4.width}
          height={mix22_4.height}
          className="object-contain absolute top-[739px] right-0 pointer-events-none select-none z-1"
        />
      </GlitchLayer>
      {/* images */}
      <div className="z-0">
        <Image
          src={top.url}
          alt="{top.alt}"
          width={top.width}
          height={top.height}
          className="object-contain absolute top-0 left-0 right-0 pointer-events-none select-none -z-10"
        />
        <Image
          src={liukanshan.url}
          alt="{liukanshan.alt}"
          width={liukanshan.width}
          height={liukanshan.height}
          className="object-contain absolute top-[424px] left-0 right-0 pointer-events-none select-none -z-10"
        />
        <Image
          src={left.url}
          alt="{left.alt}"
          width={left.width}
          height={left.height}
          className="object-contain absolute top-[442px] left-[80px] right-0 pointer-events-none select-none -z-10"
        />
        <Image
          src={middle.url}
          alt="{middle.alt}"
          width={middle.width}
          height={middle.height}
          className="object-contain absolute top-[380px] left-[180px] right-0 pointer-events-none select-none -z-10"
        />
        <Image
          src={right.url}
          alt="{right.alt}"
          width={right.width}
          height={right.height}
          className="object-contain absolute top-[422px] left-[281px] right-0 pointer-events-none select-none -z-10"
        />
      </div>
      <div className="pt-[185px] text-center z-0">
        <div className="pb-[30px]">
          <div className="mb-[10px]">
            2025年,作为尊贵的盐选会员,
            <br />
            你解锁了{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(paidContentCount ?? "paid_content_cnt")}
            </span>{" "}
            篇盐言故事,共{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(totalWordCount ?? "total_word_cnt")}
            </span>{" "}
            字
          </div>
        </div>

        <div className="">
          <div className="mb-[10px]">
            <div>是最打动你的故事元素</div>
            <div className="absolute top-[353px] left-[146px]">
              「
              <span
                className={`${colorClass("green")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(labelName1 ?? "label_name_top1")}
              </span>
              」
            </div>
            <div className="absolute top-[395px] left-[45px]">
              「
              <span
                className={`${colorClass("green")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(labelName2 ?? "label_name_top2")}
              </span>
              」
            </div>
            <div className="absolute top-[395px] left-[247px]">
              「
              <span
                className={`${colorClass("green")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(labelName3 ?? "label_name_top3")}
              </span>
              」
            </div>
          </div>
        </div>

        <div className="absolute top-[657px] left-[57px] right-[77px] text-start">
          <div className="mb-[10px]">
            你阅读最多的作者是{" "}
            <span
              className={`${colorClass("fern")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @{String(mostFavoriteAuthorName ?? "most_favorite_author_name")}
            </span>{" "}
            <br />
            TA的{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(mostFavoriteAuthorNum ?? "most_favorite_author_num")}
            </span>{" "}
            篇故事,陪你度过了不少时光
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
