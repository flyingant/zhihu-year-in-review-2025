"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { formatDateWithoutText } from "@/utils/common";
import TimeDonutChart from "@/components/report/effects/TimeDonutChart";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P12Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  // const mix8Asset = bgAsset.mix8; // Not used in JSX, commented out
  const liukanshanAsset = assets.report.p12.liukanshan;
  const sunAsset = assets.report.p12.sun;
  const moonAsset = assets.report.p12.moon;
  const barAsset = assets.report.p12.bar;

  // Map context data to component variables according to P12 spec (消费-峰值数据)
  const hours = {
    earlyMorning: Number(reportData?.early_morning_hours || 0),
    morning: Number(reportData?.morning_hours || 0),
    forenoon: Number(reportData?.forenoon_hours || 0),
    noon: Number(reportData?.noon_hours || 0),
    afternoon: Number(reportData?.afternoon_hours || 0),
    evening: Number(reportData?.evening_hours || 0),
    night: Number(reportData?.night_hours || 0),
  };

  const { month, day } = formatDateWithoutText(reportData?.zhihu_browse_last_date as string | undefined) ?? null;
  const browseLastTime = (reportData?.zhihu_browse_last_date_hour as string | undefined) ?? null;
  const browseLastCategory = (reportData?.zhihu_browse_last_content_domain as string | undefined) ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer className="z-0">
        {/* 顺序从上到下 */}
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '49px', left: '27px' }}
        />
        <Image
          src={mix7Asset.url}
          alt={mix7Asset.alt}
          width={mix7Asset.width}
          height={mix7Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '30px', right: '0px' }}
        />
        <Image
          src={mix9Asset.url}
          alt={mix9Asset.alt}
          width={mix9Asset.width}
          height={mix9Asset.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '0px', right: '0px' }}
        />
      </GlitchLayer>

      {/* 不同时段阅读足迹 */}
      <div style={{ paddingTop: '120px', paddingBottom: '10px', paddingLeft: '34px', paddingRight: '34px', fontSize: '14px' }}>
        <div style={{ fontSize: '22px' }}>
          <div>当下的专注，便是最真的你 </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          今年,你在不同时段留下自己的阅读足迹
        </div>
      </div>
      <div className="relative z-10 flex justify-center" style={{ marginBottom: '30px' }}>
        <Image src={moonAsset.url} alt="moon" width={moonAsset.width} height={moonAsset.height} className="object-contain" />
      </div>
      <div className="relative w-full flex items-center justify-center" style={{ height: '300px' }}>
        <TimeDonutChart data={hours} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src={liukanshanAsset.url}
            alt="liukanshan"
            width={liukanshanAsset.width}
            height={liukanshanAsset.height}
            className="object-contain"
            style={{ marginBottom: '10px' }}
          />
        </div>
      </div>

      <div className="relative z-10 flex justify-center" style={{ margin: '0 auto', width: '320px' }}>
        <Image src={barAsset.url} alt="bar" width={barAsset.width} height={barAsset.height} className="w-full object-contain" />
      </div>

      <div className="relative z-10 text-center text-sm font-medium leading-relaxed" style={{ marginTop: '24px' }}>
        <p className="flex items-center justify-center flex-wrap gap-1">
          <span className="text-r-yellow" style={{ fontSize: '18px' }}>{month}</span>月
          <span className="text-r-yellow" style={{ fontSize: '18px' }}>{month}</span>日
          <span className="text-r-yellow" style={{ fontSize: '18px' }}>{browseLastTime}</span>
          <span>点，你仍在看</span>
          <span className="text-r-fern" style={{ fontSize: '18px' }}>{browseLastCategory}</span>
          <span>领域的内容</span>
        </p>
      </div>

      <div className="relative z-10 flex justify-center" style={{ marginTop: '16px' }}>
        <Image src={sunAsset.url} alt="sun" width={sunAsset.width} height={sunAsset.height} className="object-contain" />
      </div>
    </BaseScene>
  );
}