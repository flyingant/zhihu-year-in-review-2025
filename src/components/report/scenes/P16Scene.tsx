"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import FollowButton from "@/components/ui/FollowButton";
import GlitchLayer from "../effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P16Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { thumbUp } = assets.report.p16;
  const { blue15, blue16, mix15_1, mix16_1, mix16_2 } = assets.report.bg;

  // Map context data to component variables according to P16 spec (社交-我关注的)
  const sendUpvoteCount = reportData?.send_upvote_cnt ?? null;
  const consumeMemberName = reportData?.consume_member_name ?? null;
  const sendMostUpvoteCount = reportData?.send_most_upvote_cnt ?? null;
  const sendMostUpvoteMemberName =
    reportData?.send_most_upvote_member_name ?? null;
  const interestMemberName1 =
    reportData?.consume_interest_member_name_top1 ?? null;
  const interestMemberName2 =
    reportData?.consume_interest_member_name_top2 ?? null;
  const interestMemberName3 =
    reportData?.consume_interest_member_name_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <GlitchLayer>
        <div className="z-0">
          <Image
            src={mix16_1.url}
            alt={mix16_1.alt}
            width={mix16_1.width}
            height={mix16_1.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "16px", right: "0" }}
          />

          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className="object-contain absolute pointer-events-none select-none z-0"
            style={{ top: "298px", left: "0" }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
            style={{ top: "112px", right: "78px" }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
            style={{ top: "753px", left: "72px" }}
          />
          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "79px", left: "0" }}
          />
          <Image
            src={mix16_2.url}
            alt={mix16_2.alt}
            width={mix16_2.width}
            height={mix16_2.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "689px", right: "0" }}
          />
        </div>
      </GlitchLayer>

      {/* main image */}
      <div className="z-0">
        <Image
          src={thumbUp.url}
          alt={thumbUp.alt}
          width={thumbUp.width}
          height={thumbUp.height}
          className="w-full absolute pointer-events-none select-none z-0"
          style={{ top: "127px", left: "0" }}
        />
      </div>
      {/* content */}
      <div
        className={typographyClass("body") + " absolute z-0"}
        style={{ top: "381px", left: "35px" }}
      >
        <div className="leading-relaxed">
          今年,你点亮了{" "}
          <span
            className={`${colorClass("pink")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            {String(sendUpvoteCount ?? "send_upvote_cnt")}
          </span>{" "}
          次赞同
        </div>

        <div className="pt-[21px] pb-[42px]">每次都是直达心灵的触动</div>

        <div className="pb-[20px]">
          你最长停在{" "}
          <span
            className={`${colorClass("yellow")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            @{String(consumeMemberName ?? "consume_member_name")}
          </span>
        </div>

        <div className="pb-[42px]">
          <div className="">
            最多的{" "}
            <span
              className={`${colorClass("fern")} ${typographyClass(
                "title"
              )} px-[2px]`}
            >
              {String(sendMostUpvoteCount ?? "send_most_upvote_cnt")}
            </span>{" "}
            个赞同, 给了{" "}
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @{String(sendMostUpvoteMemberName ?? "sote_member_name")}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <div className="">
            看看
            <br />
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px] mb-[15px] mt-[10px] flex items-center`}
            >
              @
              {String(
                interestMemberName1 ?? "consume_interest_member_name_top1"
              )}
              <FollowButton className="ml-[7px]" disabled />
            </span>
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px] mb-[15px] flex items-center`}
            >
              @
              {String(
                interestMemberName2 ?? "consume_interest_member_name_top2"
              )}
              <FollowButton className="ml-[7px]" />
            </span>
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px] mb-[15px] flex items-center`}
            >
              @
              {String(
                interestMemberName3 ?? "consume_interest_member_name_top3"
              )}
              <FollowButton className="ml-[7px]" />
            </span>
          </div>
          <div>或许也能给你一丝启发</div>
        </div>
      </div>
    </BaseScene>
  );
}
