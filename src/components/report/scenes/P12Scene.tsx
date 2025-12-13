"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

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
  const mix8Asset = bgAsset.mix8;
  const liukanshanAsset = assets.report.p12.liukanshan;
  const sunAsset = assets.report.p12.sun;
  const moonAsset = assets.report.p12.moon;
  const barAsset = assets.report.p12.bar;
  const clockAsset = assets.report.p12.clock;
  

  // Map context data to component variables according to P12 spec (消费-峰值数据)
  const earlyMorningHours = reportData?.early_morning_hours ?? null;
  const morningHours = reportData?.morning_hours ?? null;
  const forenoonHours = reportData?.forenoon_hours ?? null;
  const noonHours = reportData?.noon_hours ?? null;
  const afternoonHours = reportData?.afternoon_hours ?? null;
  const eveningHours = reportData?.evening_hours ?? null;
  const nightHours = reportData?.night_hours ?? null;
  const browseMostDate = reportData?.zhihu_browse_most_date ?? null;
  const browseMostDateDuration = reportData?.zhihu_browse_most_date_duration ?? null;
  const browseLastDate = reportData?.zhihu_browse_last_date ?? null;
  const browseLastTime = reportData?.zhihu_browse_last_time ?? null;
  const browseLastCategory = reportData?.zhihu_browse_last_category ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer className="z-0">
        {/* 顺序从上到下 */}
        <Image src={blue10Asset.url} alt="{blue10Asset.alt}" width={blue10Asset.width} height={blue10Asset.height} 
          className="object-contain absolute top-[49px] left-[27px] pointer-events-none select-none z-1" />
        <Image src={mix7Asset.url} alt="{mix7Asset.alt}" width={mix7Asset.width} height={mix7Asset.height} 
          className="object-contain absolute top-[30px] right-[0px] pointer-events-none select-none z-1" />
        <Image src={mix9Asset.url} alt="{mix9Asset.alt}" width={mix9Asset.width} height={mix9Asset.height} 
          className="object-contain absolute bottom-[0] right-[0px] pointer-events-none select-none z-1" />
      </GlitchLayer>
      {/* 不同时段阅读足迹 */}
      <div className="pt-[120px] pb-[10px]">
        <div className={typographyClass('title') + ' leading-relaxed'}>
          <div>当下的专注，便是最真的你 </div>
        </div>
        <div className="mb-[20px]">
          今年,你在不同时段留下自己的阅读足迹
        </div>
      </div>
       <div className="relative z-10 mb-4 flex justify-center">
         <Image src={moonAsset.url} alt="moon" width={moonAsset.width} height={moonAsset.height} className="object-contain" />
      </div>
      <div className="relative w-full h-[280px] flex items-center justify-center">
        <Image src={clockAsset.url} alt="clock" fill className="object-contain" />
        
        {/* 中间的刘看山 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src={liukanshanAsset.url} alt="liukanshan" width={liukanshanAsset.width} height={liukanshanAsset.height} className="object-contain scale-90" />
        </div>

        {/* 0-5点 (右侧大块粉色) */}
        <div className="absolute right-[10px] top-[20%] text-right leading-tight">
            <div className="text-xs font-bold">0-5 点</div>
            <div className="text-xl font-black">28%</div>
        </div>

        {/* 5-8点 (右下粉色) */}
        <div className="absolute right-[20px] bottom-[15%] text-right leading-tight">
            <div className="text-xs font-bold">5-8 点</div>
            <div className="text-xs">10%</div>
        </div>

        {/* 8-11点 (右下蓝色) */}
        <div className="absolute right-[70px] bottom-[-10px] text-center leading-tight">
            <div className="text-xs font-bold">8-11 点</div>
            <div className="text-xs">10%</div>
        </div>

        {/* 11-13点 (底部青色) */}
        <div className="absolute left-[160px] bottom-[-30px] text-center leading-tight">
            <div className="text-xs font-bold">11-13 点</div>
            <div className="text-xs">10%</div>
        </div>

        {/* 13-17点 (左下绿色) */}
        <div className="absolute left-[040px] bottom-[0%] text-left leading-tight">
            <div className="text-xs font-bold">13-17 点</div>
            <div className="text-xs">10%</div>
        </div>

        {/* 17-19点 (左侧黄色) */}
        <div className="absolute left-[10px] top-[40%] text-left leading-tight">
            <div className="text-xs font-bold">17-19 点</div>
            <div className="text-xs">10%</div>
        </div>

          {/* 19-24点 (左上橙色) */}
          <div className="absolute left-[40px] top-[5%] text-left leading-tight">
            <div className="text-xs font-bold">19-24 点</div>
            <div className="text-xs">10%</div>
        </div>
      </div>
      <div className="relative z-10  w-full flex justify-center">
         <Image src={barAsset.url} alt="bar" width={barAsset.width} height={barAsset.height} className="w-full object-contain" />
      </div>

      <div className="relative z-10 mt-6 text-center text-sm font-medium leading-relaxed">
        <p className="flex items-center justify-center flex-wrap gap-1">
            <span className={`${colorClass('yellow')} text-lg font-bold pixel-font`}>{String(browseLastDate ?? '10 月 10 日')}</span>
            <span>{String(browseLastTime ?? '10')} 点，你仍在看</span>
            <span className={`${colorClass('green')} text-lg font-bold pixel-font`}>{String(browseLastCategory ?? '体育')}</span>
            <span>领域的内容</span>
        </p>
      </div>
       <div className="relative z-10 mt-4 flex justify-center">
         <Image src={sunAsset.url} alt="sun" width={sunAsset.width} height={sunAsset.height} className="object-contain" />
      </div>
    </BaseScene>
  );
}

