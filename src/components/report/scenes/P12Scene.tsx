"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P12Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
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
      <div className={typographyClass('title') + ' leading-relaxed mb-[40px]'}>
        当下的专注,便是最真的你
      </div>

      {/* 不同时段阅读足迹 */}
      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[20px]">
          今年,你在不同时段留下自己的阅读足迹
        </div>
        <div className="text-sm space-y-[8px]">
          <div>
            凌晨(0-5点): <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(earlyMorningHours ?? 'early_morning_hours')}</span> 小时
          </div>
          <div>
            早晨(5-8点): <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(morningHours ?? 'morning_hours')}</span> 小时
          </div>
          <div>
            上午(8-11点): <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(forenoonHours ?? 'forenoon_hours')}</span> 小时
          </div>
          <div>
            中午(11-13点): <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(noonHours ?? 'noon_hours')}</span> 小时
          </div>
          <div>
            下午(13-17点): <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(afternoonHours ?? 'afternoon_hours')}</span> 小时
          </div>
          <div>
            晚上(19-23点): <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(eveningHours ?? 'evening_hours')}</span> 小时
          </div>
          <div>
            深夜(23-5点): <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(nightHours ?? 'night_hours')}</span> 小时
          </div>
        </div>
      </div>

      {/* 停留最晚的一天 */}
      <div className="pt-[40px] pb-[20px]">
        <div className="mb-[10px]">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(browseLastDate ?? 'zhihu_browse_last_date')}</span> 是你今年在知乎停留最晚的一天
        </div>
        <div className="text-sm">
          这天 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(browseLastTime ?? 'zhihu_browse_last_time')}</span> 点,你还在看 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(browseLastCategory ?? 'zhihu_browse_last_category')}</span> 领域的内容
        </div>
      </div>
    </BaseScene>
  );
}

