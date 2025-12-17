"use client";

import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { useUserReportData } from "@/context/user-report-data-context";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { useState } from "react";
import { handleSaveImage } from "@/utils/common";
import BaseScene from "@/components/report/scenes/BaseScene";

const tianwangFont = localFont({
  src: "../../../public/fonts/tianwangxingxiangsu.ttf",
  variable: "--font-tianwang",
  display: "swap",
});

function GuessPageScene() {
  const { summaryPoster } = useUserReportData();
  const { assets } = useAssets();
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(
    null
  );
  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const titleOtherAsset = p28Assets.titleOther;

  const options = [
    {
      optionName: "我真的爱了",
      key: "love",
    },
    {
      key: "action",
      optionName: "我真的行动了",
    },
    {
      key: "good",
      optionName: "我真的很棒了",
    },
    {
      key: "clam",
      optionName: "我真的清醒了",
    },
  ];
  return (
    <BaseScene showBottomNextButton={false}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={titleOtherAsset.url}
          alt={titleOtherAsset.alt}
          width={titleOtherAsset.width}
          height={titleOtherAsset.height}
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 114 }}
        />

        <div className="relative" style={{ top: 131, left: 20, right: 20 }}>
          {options.map((option) => (
            <div
              key={option.key}
              style={{ marginTop: 30, height: 95, width: 344 }}
              onClick={() => setSelectedOptionKey(option.key)}
            >
              <Image
                src={`/assets/2025-28-banner-${option.key}-${
                  selectedOptionKey === option.key ? "active" : "grey"
                }.png`}
                width={344}
                height={95}
                alt="banner"
              />
            </div>
          ))}
        </div>
        <button
          className="absolute left-1/2 -translate-x-1/2  z-60 px-8 py-3 rounded-full bg-black text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            width: 165,
            bottom: 60,
          }}
          disabled={!selectedOptionKey}
        >
          确认选择
        </button>
      </div>
    </BaseScene>
  );
}

export default function GuessPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <main
        className={`w-full h-screen bg-white text-black ${tianwangFont.variable}`}
      >
        <UserReportDataProvider>
          <GridBackground />
          <GuessPageScene />
        </UserReportDataProvider>
      </main>
    </AuthWrapper>
  );
}
