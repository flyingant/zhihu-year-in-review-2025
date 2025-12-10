"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import ZhihuLogo from "@/components/ui/ZhihuLogo";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P18Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();

  if (!assets) return null;

  // const { ity, pointer1, pointer2, pointer3, pointer4, pointer5 } =
  //   assets.report.p17;
  const { main } = assets.report.p18;
  const { blue15, blue16, mix15_1, mix15_2, mix16_1, mix16_2 } =
    assets.report.bg;

  // Map context data to component variables according to P18 spec (社交-圈子主理人)
  const clubAdminTop1Name = reportData?.club_admin_top1_name ?? null;
  const clubAdminTop1MemberCount =
    reportData?.club_admin_top1_member_cnt ?? null;
  const clubAdminTop1ContentCount =
    reportData?.club_admin_top1_content_cnt ?? null;
  const clubAdminTop1PinCount = reportData?.club_admin_top1_pin_cnt ?? null;
  const clubAdminTop1InteractionCount =
    reportData?.club_admin_top1_interaction_cnt ?? null;
  const clubAdminTop2Name = reportData?.club_admin_top2_name ?? null;
  const clubAdminTop2MemberCount =
    reportData?.club_admin_top2_member_cnt ?? null;
  const clubAdminTop2ContentCount =
    reportData?.club_admin_top2_content_cnt ?? null;
  const clubAdminTop2PinCount = reportData?.club_admin_top2_pin_cnt ?? null;
  const clubAdminTop2InteractionCount =
    reportData?.club_admin_top2_interaction_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* logo */}
      <div className="pt-[55px] pb-[35px]">
        <ZhihuLogo />
      </div>
      {/* background */}
      <div className="z-0">
        <Image
          src={main.url}
          alt={main.alt}
          width={main.width}
          height={main.height}
          className="object-contain absolute top-[290px] left-0 pointer-events-none select-none z-1"
        />
        <Image
          src={mix16_1.url}
          alt={mix16_1.alt}
          width={mix16_1.width}
          height={mix16_1.height}
          className="object-contain absolute top-[583px] left-[91px] w-[88px] h-[24px] pointer-events-none select-none z-1"
        />
        <Image
          src={blue16.url}
          alt={blue16.alt}
          width={blue16.width}
          height={blue16.height}
          className="object-contain absolute top-[34px] left-[300px] w-[27px] h-[27px] pointer-events-none select-none z-0"
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain rotate-90 absolute top-[181px] right-[11px] w-[35px] h-[35px] pointer-events-none select-none z-0"
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain rotate-90 absolute top-[753px] left-[72px] pointer-events-none select-none z-0"
        />
        <Image
          src={mix15_1.url}
          alt={mix15_1.alt}
          width={mix15_1.width}
          height={mix15_1.height}
          className="object-contain absolute top-[557px] -left-[2px] w-[124px] h-[30px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix15_2.url}
          alt={mix15_2.alt}
          width={mix15_2.width}
          height={mix15_2.height}
          className="object-contain absolute top-[163px] -left-[2px] w-[117px] h-[26px] pointer-events-none select-none z-1"
        />
        <Image
          src={mix16_2.url}
          alt={mix16_2.alt}
          width={mix16_2.width}
          height={mix16_2.height}
          className="object-contain absolute top-[741px] left-[225px] w-[139px] h-[70px] pointer-events-none select-none z-1"
        />
      </div>
      {/* content */}
      <div className="z-0">
        <div
          className={
            typographyClass("subtitle") +
            " leading-relaxed absolute left-[30px]"
          }
        >
          感谢有你,圈子一直在发光
        </div>

        <div
          className={
            typographyClass("body") +
            " absolute w-[321px] text-center left-[17px] top-[233px]"
          }
        >
          <span
            className={`${colorClass("blue")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            「{String(clubAdminTop1Name ?? "club_admin_top1_name")} 」
          </span>
          圈
          <br />
          的主理人,你好
        </div>

        <div
          className={
            typographyClass("body") + " absolute right-[14px] top-[290px]"
          }
        >
          <span
            className={`${colorClass("green")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            {String(clubAdminTop1MemberCount ?? "clubAdminTop1MemberCount")}
          </span>
          <br />
          位圈友
        </div>

        <div
          className={
            typographyClass("body") +
            " absolute left-[27px] top-[483px] w-[66px] text-right"
          }
        >
          <span
            className={`${colorClass("yellow")} ${typographyClass(
              "subtitle"
            )} px-[2px]`}
          >
            {String(clubAdminTop1MemberCount ?? "clubAdminTop1MemberCount")}
          </span>
          <br />
          条讨论
        </div>

        <div
          className={
            typographyClass("body") + " absolute left-[30px] top-[631px]"
          }
        >
          作为引路人,你在圈内发言{" "}
          <span
            className={`${colorClass("pink")} ${typographyClass(
              "title"
            )} px-[2px]`}
          >
            {String(clubAdminTop2PinCount ?? "club_admin_top2_pin_cnt")}
          </span>{" "}
          次 <br />
          <span>
            与{" "}
            <span
              className={`${colorClass("green")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                clubAdminTop2InteractionCount ??
                  "club_admin_top2_interaction_cnt"
              )}
            </span>{" "}
            位圈友交换了想法
          </span>
        </div>

        {/* <div className="pb-[30px]">
          <div className="mb-[10px]">
            2025年,{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(clubAdminTop1MemberCount ?? "club_admin_top1_member_cnt")}
            </span>{" "}
            位圈友在你的带领下相聚
          </div>
          <div>
            共同创造了{" "}
            <span
              className={`${colorClass("fern")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                clubAdminTop1ContentCount ?? "club_admin_top1_content_cnt"
              )}
            </span>{" "}
            条真实、滚烫的讨论
          </div>
        </div> */}

        {/* <div className="pb-[30px]">
          <div className="mb-[10px]">
            作为引路人,你在圈内发言{" "}
            <span
              className={`${colorClass("green")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(clubAdminTop1PinCount ?? "club_admin_top1_pin_cnt")}
            </span>{" "}
            次
          </div>
          <div>
            与{" "}
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(
                clubAdminTop1InteractionCount ??
                  "club_admin_top1_interaction_cnt"
              )}
            </span>{" "}
            位圈友交换了想法
          </div>
        </div> */}

        {/* 第二个圈子 */}
        {/* <div className="pt-[40px] pb-[20px]">
          <div className="mb-[10px]">
            「
            <span
              className={`${colorClass("blue")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(clubAdminTop2Name ?? "club_admin_top2_name")}
            </span>
            」圈的主理人,你好
          </div>
          <div className="pb-[20px]">
            <div className="mb-[10px]">
              2025年,{" "}
              <span
                className={`${colorClass("pink")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(
                  clubAdminTop2MemberCount ?? "club_admin_top2_member_cnt"
                )}
              </span>{" "}
              位圈友在你的带领下相聚
            </div>
            <div>
              共同创造了{" "}
              <span
                className={`${colorClass("fern")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(
                  clubAdminTop2ContentCount ?? "club_admin_top2_content_cnt"
                )}
              </span>{" "}
              条真实、滚烫的讨论
            </div>
          </div>
          <div>
            <div className="mb-[10px]">
              作为引路人,你在圈内发言{" "}
              <span
                className={`${colorClass("green")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(clubAdminTop2PinCount ?? "club_admin_top2_pin_cnt")}
              </span>{" "}
              次
            </div>
            <div>
              与{" "}
              <span
                className={`${colorClass("blue")} ${typographyClass(
                  "subtitle"
                )} px-[2px]`}
              >
                {String(
                  clubAdminTop2InteractionCount ??
                    "club_admin_top2_interaction_cnt"
                )}
              </span>{" "}
              位圈友交换了想法
            </div>
          </div>
        </div> */}
      </div>
    </BaseScene>
  );
}
