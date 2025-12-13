"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import GlitchLayer from "../effects/GlitchLayer";
import ActionsButton from "@/components/ui/ActionsButton";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P20Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { main } = assets.report.p20;
  const { blue15, blue16, mix15_1, mix16_1, mix20 } = assets.report.bg;

  // Map context data to component variables according to P20 spec (社交圈子用户)
  // Night Club Publish
  const nightClubPinTime = reportData?.night_club_pin_time ?? null;
  const nightClubPinClubName = reportData?.night_club_pin_club_name ?? null;
  const nightClubPinTitle = reportData?.night_club_pin_title ?? null;

  // Club Friend Count / Expansion
  const clubFriendCount = reportData?.club_friend_cnt ?? null;

  // Most Interacted Club Members
  const mostInteractionMemberName1 =
    reportData?.most_interaction_club_member_name_top1 ?? null;
  const mostInteractionMemberName2 =
    reportData?.most_interaction_club_member_name_top2 ?? null;
  const mostInteractionMemberName3 =
    reportData?.most_interaction_club_member_name_top3 ?? null;

  // Most Active Clubs / "Spiritual Strongholds"
  const clubActiveListName1 = reportData?.club_active_list_name_top1 ?? null;
  const clubActiveListName2 = reportData?.club_active_list_name_top2 ?? null;
  const clubActiveListName3 = reportData?.club_active_list_name_top3 ?? null;

  // Recommended Clubs / "Next Stop"
  const clubInterestListName1 =
    reportData?.club_interest_list_name_top1 ?? null;
  const clubInterestListName2 =
    reportData?.club_interest_list_name_top2 ?? null;
  const clubInterestListName3 =
    reportData?.club_interest_list_name_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <GlitchLayer>
        <div className="z-0">
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
            style={{ top: "58px", left: "27px", width: "35px", height: "35px" }}
          />
          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className="object-contain absolute pointer-events-none select-none z-0"
            style={{
              top: "310px",
              right: "60px",
              width: "27px",
              height: "27px",
            }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className="object-contain absolute pointer-events-none select-none z-0"
            style={{
              top: "742px",
              right: "66px",
              width: "34px",
              height: "34px",
            }}
          />
          <Image
            src={mix15_1.url}
            alt={mix15_1.alt}
            width={mix15_1.width}
            height={mix15_1.height}
            className="object-contain absolute pointer-events-none select-none z-0"
            style={{ top: "250px", left: "0", width: "124px", height: "30px" }}
          />
          <Image
            src={mix16_1.url}
            alt={mix16_1.alt}
            width={mix16_1.width}
            height={mix16_1.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{
              top: "268px",
              left: "18px",
              width: "88px",
              height: "24px",
            }}
          />

          <Image
            src={mix20.url}
            alt={mix20.alt}
            width={mix20.width}
            height={mix20.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "618px", right: "0" }}
          />
        </div>
      </GlitchLayer>

      {/* main images */}
      <div className="z-0">
        <Image
          src={main.url}
          alt={main.alt}
          width={main.width}
          height={main.height}
          className="object-contain absolute pointer-events-none select-none z-20"
          style={{ top: "228px", right: "0" }}
        />
      </div>

      {/* content */}
      <div className="z-0">
        {/* Night Club Publish */}
        <div
          className="absolute"
          style={{ top: "170px", left: "34px", right: "19px" }}
        >
          <div className="leading-[29px]">
            你在圈子里「扩列」了
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(nightClubPinClubName ?? "night_club_pin_club_name")}
            </span>
            位好友
            <br />
            希望新的一年，你能遇见更多同频的人
          </div>
        </div>
        {/* Most Favorite Spots */}
        <div className="z-30 absolute top-[300px] left-[34px] right-[34px]">
          <span>
            「{String(clubActiveListName1 ?? "club_active_list_name_top1")}」
          </span>
          <span>
            「{String(clubActiveListName2 ?? "club_active_list_name_top2")}」
          </span>
          <span>
            「{String(clubActiveListName3 ?? "club_active_list_name_top3")}」
          </span>
          是你今年最爱的「精神据点」
        </div>

        {/* Most Interacted Club Members */}
        <div
          className="absolute"
          style={{ top: "578px", left: "34px", right: "34px" }}
        >
          <div className="flex flex-col leading-[34px]">
            与你互动最多的圈友是：
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                mostInteractionMemberName1 ??
                  "most_interaction_club_member_name_top1"
              )}
            </span>
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                mostInteractionMemberName2 ??
                  "most_interaction_club_member_name_top2"
              )}
            </span>
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              @
              {String(
                mostInteractionMemberName3 ??
                  "most_interaction_club_member_name_top3"
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            要不要
            <ActionsButton type="message" onClick={() => {}} />
            {/* <ActionsButton type="join" onClick={() => {}} /> */}
            {/* <ActionsButton type="joined" onClick={() => {}} /> */}
            送他们一个大拇指？
          </div>
        </div>

        {/* Recommended Clubs */}
        <div
          className="absolute z-30"
          style={{ top: "378px", left: "34px", right: "34px" }}
        >
          <div className="flex flex-col leading-[34px]">
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                mostInteractionMemberName1 ??
                  "most_interaction_club_member_name_top1"
              )}
              <ActionsButton type="message" onClick={() => {}} />
            </span>
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                mostInteractionMemberName2 ??
                  "most_interaction_club_member_name_top2"
              )}
              <ActionsButton type="join" onClick={() => {}} />
            </span>
            <span
              className={`${colorClass("yellow")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                mostInteractionMemberName3 ??
                  "most_interaction_club_member_name_top3"
              )}
              <ActionsButton type="joined" onClick={() => {}} />
            </span>
          </div>
          <div className="flex items-center gap-1">
            或许会是你的下一站 <br />
            点击加入一起开启新年新旅程吧
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
