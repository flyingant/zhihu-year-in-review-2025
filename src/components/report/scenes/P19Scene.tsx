"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P19Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, pink, tiffany, yellow, blue } = assets.report.p19;
  const { blue15, blue16, mix15_1, mix15_2, mix16_1, mix19 } = assets.report.bg;

  // Map context data to component variables according to P19 spec (社交-圈子用户)
  const joinClubCount = reportData?.join_club_cnt ?? null;
  const joinClubPercentage = reportData?.join_club_percentage ?? null;
  const consumeMostClubName = reportData?.consume_most_club_name ?? null;
  const consumeMostClubPv = reportData?.consume_most_club_pv ?? null;
  const interactiveMostClubName =
    reportData?.interactive_most_club_name ?? null;
  const interactiveMostClubCommentCount =
    reportData?.interactive_most_club_comment_cnt ?? null;
  const interactiveMostClubUpvoteCount =
    reportData?.interactive_most_club_upvote_cnt ?? null;
  const interactionMostPinClubName =
    reportData?.interaction_most_pin_club_name ?? null;
  const interactionMostPinTitle =
    reportData?.interaction_most_pin_title ?? null;
  const interactionMostPinInteractionCount =
    reportData?.interaction_most_pin_interaction_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <div className="z-0">
        <Image
          src={mix16_1.url}
          alt={mix16_1.alt}
          width={mix16_1.width}
          height={mix16_1.height}
          className="object-contain absolute top-[131px] right-px w-[87px] h-[24px] pointer-events-none select-none z-1"
        />
        <Image
          src={blue16.url}
          alt={blue16.alt}
          width={blue16.width}
          height={blue16.height}
          className="object-contain absolute top-[173px] right-[26px] w-[27px] h-[27px] pointer-events-none select-none z-0"
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain rotate-90 absolute top-[32px] left-[17px] w-[35px] h-[35px] pointer-events-none select-none z-0"
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain absolute top-[763px] right-[72px] w-[32px] h-[34px] pointer-events-none select-none z-0"
        />
        <Image
          src={mix15_1.url}
          alt={mix15_1.alt}
          width={mix15_1.width}
          height={mix15_1.height}
          className="object-contain absolute top-[112px] -right-6 w-[124px] h-[30px] pointer-events-none select-none z-0"
        />
        <Image
          src={mix15_2.url}
          alt={mix15_2.alt}
          width={mix15_2.width}
          height={mix15_2.height}
          className="object-contain absolute top-[459px] -right-[4px] w-[117px] h-[26px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix19.url}
          alt={mix19.alt}
          width={mix19.width}
          height={mix19.height}
          className="object-contain absolute top-[724px] left-px pointer-events-none select-none z-1"
        />
        <Image
          src={liukanshan.url}
          alt={liukanshan.alt}
          width={liukanshan.width}
          height={liukanshan.height}
          className="object-contain absolute top-[440px] left-0 pointer-events-none select-none z-1"
        />
        <Image
          src={pink.url}
          alt={pink.alt}
          width={pink.width}
          height={pink.height}
          className="object-contain absolute top-[80px] left-px pointer-events-none select-none z-1"
        />
        <Image
          src={tiffany.url}
          alt={tiffany.alt}
          width={tiffany.width}
          height={tiffany.height}
          className="object-contain absolute top-[542px] left-0 pointer-events-none select-none z-1"
        />
        <Image
          src={yellow.url}
          alt={yellow.alt}
          width={yellow.width}
          height={yellow.height}
          className="object-contain absolute top-[268px] left-px pointer-events-none select-none z-1"
        />
        <Image
          src={blue.url}
          alt={blue.alt}
          width={blue.width}
          height={blue.height}
          className="object-contain absolute top-[307px] left-px pointer-events-none select-none z-1"
        />
      </div>
      <div className="z-0">
        <div
          className={
            typographyClass("body") + " absolute top-[184px] left-[36px]"
          }
        >
          <span className={`${typographyClass("subtitle")} px-[2px]`}>
            2025
          </span>
          年 , 你加入了{" "}
          <span
            className={`${colorClass("pink")} ${typographyClass(
              "title"
            )} px-[2px]`}
          >
            {String(joinClubCount ?? "join_club_cnt")}
          </span>{" "}
          个圈子 <br />
          对同好社交的热情超过了{" "}
          <span
            className={`${colorClass("green")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            {String(joinClubPercentage ?? "join_club_percentage")}
          </span>
          % 的知友
        </div>
        <div className="absolute top-[360px] left-[141px]">
          <div className="mb-[10px]">
            你在
            <span
              className={`${colorClass("purple")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              「{String(consumeMostClubName ?? "consume_most_club_name")}」
            </span>
            停留最久，驻足{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(consumeMostClubPv ?? "consume_most_club_pv")}
            </span>{" "}
            次
          </div>
        </div>
        <div className="absolute top-[540px] left-[17px] z-2">
          <div className={typographyClass("body")}>
            在
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              「
              {String(interactiveMostClubName ?? "interactive_most_club_name")}
              」
            </span>
            圈 <br />
            你留下了
            <span
              className={`${colorClass("green")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                interactiveMostClubCommentCount ??
                  "interactive_most_club_comment_cnt"
              )}
            </span>{" "}
            条讨论 <br />
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                interactiveMostClubUpvoteCount ??
                  "interactive_most_club_upvote_cnt"
              )}
            </span>{" "}
            个赞同
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
