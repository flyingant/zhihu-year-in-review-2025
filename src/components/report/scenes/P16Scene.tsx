"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from '@/context/assets-context';
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P16Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { thumbUp } = assets.report.p16;

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
      <div className="z-0">
        <Image src={thumbUp.url} alt={thumbUp.alt} width={thumbUp.width} height={thumbUp.height}
          className="object-contain absolute top-[120px] left-0 pointer-events-none select-none z-0" />
      </div>
      <div className="z-0">
        <div className={typographyClass("title") + " leading-relaxed"}>
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

        <div className="pt-[60px] pb-[20px]">每次都是直达心灵的触动</div>

        <div className="pb-[30px]">
          你最常停在{" "}
          <span
            className={`${colorClass("blue")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            @{String(consumeMemberName ?? "consume_member_name")}
          </span>{" "}
          的页面
        </div>

        <div className="pb-[30px]">
          <div className="mb-[10px]">
            最多的{" "}
            <span
              className={`${colorClass("fern")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(sendMostUpvoteCount ?? "send_most_upvote_cnt")}
            </span>{" "}
            次赞同,给了{" "}
            <span
              className={`${colorClass("green")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                sendMostUpvoteMemberName ?? "send_most_upvote_member_name"
              )}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <div className="mb-[10px]">
            看看{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                interestMemberName1 ?? "consume_interest_member_name_top1"
              )}
            </span>{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                interestMemberName2 ?? "consume_interest_member_name_top2"
              )}
            </span>{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                interestMemberName3 ?? "consume_interest_member_name_top3"
              )}
            </span>{" "}
            的内容
          </div>
          <div>或许也能给你一丝启发</div>
        </div>
      </div>
    </BaseScene>
  );
}
