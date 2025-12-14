"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import GlitchLayer from "../effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P18Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();

  if (!assets) return null;

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
      {/* background */}
      <GlitchLayer>
        <div className="z-0">
          <Image
            src={mix16_1.url}
            alt={mix16_1.alt}
            width={mix16_1.width}
            height={mix16_1.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{
              top: "583px",
              left: "91px",
              width: "88px",
              height: "24px",
            }}
          />
          <Image
            src={blue16.url}
            alt={blue16.alt}
            width={blue16.width}
            height={blue16.height}
            className="object-contain absolute pointer-events-none select-none z-0"
            style={{
              top: "34px",
              left: "300px",
              width: "27px",
              height: "27px",
            }}
          />
          <Image
            src={blue15.url}
            alt={blue15.alt}
            width={blue15.width}
            height={blue15.height}
            className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
            style={{
              top: "181px",
              right: "11px",
              width: "35px",
              height: "35px",
            }}
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
            style={{
              top: "557px",
              left: "-2px",
              width: "124px",
              height: "30px",
            }}
          />
          <Image
            src={mix15_2.url}
            alt={mix15_2.alt}
            width={mix15_2.width}
            height={mix15_2.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{
              top: "163px",
              left: "-2px",
              width: "117px",
              height: "26px",
            }}
          />
          <Image
            src={mix16_2.url}
            alt={mix16_2.alt}
            width={mix16_2.width}
            height={mix16_2.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{
              top: "741px",
              left: "225px",
              width: "139px",
              height: "70px",
            }}
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
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "290px", left: "0" }}
        />
      </div>
      {/* content */}
      <div className="z-0" style={{ fontSize: 14 }}>
        <div
          className={"text-xl leading-relaxed absolute"}
          style={{ left: "30px", top: "121px" }}
        >
          感谢有你,圈子一直在发光
        </div>

        <div
          className={" absolute text-center"}
          style={{ width: "321px", left: "17px", top: "233px" }}
        >
          <span className={`text-r-blue px-[7px]`} style={{ fontSize: 20 }}>
            「{String(clubAdminTop1Name ?? "club_admin_top1_name")} 」
          </span>
          圈
          <br />
          的主理人,你好
        </div>

        <div className={" absolute"} style={{ right: "14px", top: "290px" }}>
          <span className={`text-r-green px-[2px]`} style={{ fontSize: 18 }}>
            {String(clubAdminTop1MemberCount ?? "clubAdminTop1MemberCount")}
          </span>
          <br />
          位圈友
        </div>

        <div
          className={" absolute text-right"}
          style={{ left: "27px", top: "483px", width: "66px" }}
        >
          <span className={`text-r-yellow px-[2px]`} style={{ fontSize: 18 }}>
            {String(clubAdminTop1MemberCount ?? "clubAdminTop1MemberCount")}
          </span>
          <br />
          条讨论
        </div>

        <div className={" absolute"} style={{ left: "30px", top: "631px" }}>
          作为引路人,你在圈内发言
          <span className={`text-r-pink px-[7px]`} style={{ fontSize: 24 }}>
            {String(clubAdminTop2PinCount ?? "club_admin_top2_pin_cnt")}
          </span>
          次 <br />
          <span>
            与
            <span className={`text-r-fern px-[7px]`} style={{ fontSize: 18 }}>
              {String(
                clubAdminTop2InteractionCount ??
                  "club_admin_top2_interaction_cnt"
              )}
            </span>
            位圈友交换了想法
          </span>
        </div>
      </div>
    </BaseScene>
  );
}
