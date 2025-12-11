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

export default function P22Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, front, back } = assets.report.p22;
  const { mix22_1, mix22_2, mix22_3, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P22 spec (特殊-热点数据)
  // Billboard browsing
  const consumeBillboardDays = reportData?.consume_billboard_days ?? null;
  const consumeBillboardContentCount =
    reportData?.consume_billboard_content_cnt ?? null;

  // Upvoted content on billboard
  const upvoteZhihuBillboardContentCount =
    reportData?.upvote_zhihu_billboard_content_cnt ?? null;

  // Hot events
  const eventMonth = reportData?.event_month ?? null;
  const eventName = reportData?.event_name ?? null;
  const eventUpvoteCount = reportData?.event_upvote_cnt ?? null;
  const eventMemberCount = reportData?.event_member_cnt ?? null;

  // Event hours
  const eventMostHourName = reportData?.event_most_hour_name ?? null;
  const eventMostHour = reportData?.event_most_hour ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* mix block */}
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
          src={mix22_2.url}
          alt="{mix22_2.alt}"
          width={mix22_2.width}
          height={mix22_2.height}
          className="object-contain absolute top-[93px] right-0 pointer-events-none select-none z-1"
        />
        <Image
          src={mix22_3.url}
          alt="{mix22_3.alt}"
          width={mix22_3.width}
          height={mix22_3.height}
          className="object-contain absolute top-[388px] left-0 pointer-events-none select-none z-1"
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
          src={front.url}
          alt="{front.alt}"
          width={front.width}
          height={front.height}
          className="object-contain absolute top-[386px] right-0 left-0 pointer-events-none select-none z-20"
        />
        <Image
          src={back.url}
          alt="{back.alt}"
          width={back.width}
          height={back.height}
          className="object-contain absolute top-[212px] right-0 pointer-events-none select-none z-1"
        />
        <Image
          src={liukanshan.url}
          alt="{liukanshan.alt}"
          width={liukanshan.width}
          height={liukanshan.height}
          className="object-contain absolute top-[563px] left-[135px] pointer-events-none select-none z-1"
        />
      </div>
      {/* content */}
      <div className="z-0 relative">
        <div className="absolute top-[116px] left-[41px]">
          当你关注时代时，
          <br />
          你也正成为时代的一部分
        </div>
        {/* Billboard browsing */}
        <div className="absolute top-[216px] left-[41px]">
          <div className="mb-[10px]">
            你今年驻扎热榜{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(consumeBillboardDays ?? "consume_billboard_days")}
            </span>{" "}
            天,
            <br />
            浏览了{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                consumeBillboardContentCount ?? "consume_billboard_content_cnt"
              )}
            </span>{" "}
            条热榜内容
          </div>
        </div>

        {/* Upvoted content on billboard */}
        <div className="absolute top-[316px] left-[41px]">
          <div className="mb-[10px]">
            你的赞同, 助推{" "}
            <span
              className={`${colorClass("fern")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                upvoteZhihuBillboardContentCount ??
                  "upvote_zhihu_billboard_content_cnt"
              )}
            </span>{" "}
            篇内容登上了知乎热榜
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
