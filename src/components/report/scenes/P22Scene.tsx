"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P22Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P22 spec (特殊-热点数据)
  // Billboard browsing
  const consumeBillboardDays = reportData?.consume_billboard_days ?? null;
  const consumeBillboardContentCount = reportData?.consume_billboard_content_cnt ?? null;
  
  // Upvoted content on billboard
  const upvoteZhihuBillboardContentCount = reportData?.upvote_zhihu_billboard_content_cnt ?? null;
  
  // Hot events
  const eventMonth = reportData?.event_month ?? null;
  const eventName = reportData?.event_name ?? null;
  const eventUpvoteCount = reportData?.event_upvote_cnt ?? null;
  const eventMemberCount = reportData?.event_member_cnt ?? null;
  
  // Event hours
  const eventMostHourName = reportData?.event_most_hour_name ?? null;
  const eventMostHour = reportData?.event_most_hour ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        特殊-热点数据
      </div>

      {/* Billboard browsing */}
      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          你今年驻扎热榜 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(consumeBillboardDays ?? 'consume_billboard_days')}</span> 天,浏览了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(consumeBillboardContentCount ?? 'consume_billboard_content_cnt')}</span> 条热榜内容
        </div>
      </div>

      {/* Upvoted content on billboard */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          你的赞同助推 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(upvoteZhihuBillboardContentCount ?? 'upvote_zhihu_billboard_content_cnt')}</span> 篇内容登上了知乎热榜
        </div>
      </div>

      {/* Annual Ten Questions */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          2025年,你浏览过「年度十问」的哪些相关提问?
        </div>
      </div>

      {/* Hot events */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          当你面向时代求真,时代也在折射你
        </div>
        <div className="text-sm">
          <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventMonth ?? 'event_month')}</span> 月里,你参与讨论了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventName ?? 'event_name')}</span> 事件
        </div>
        <div className="text-sm">
          收获 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventUpvoteCount ?? 'event_upvote_cnt')}</span> 个赞同,和 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventMemberCount ?? 'event_member_cnt')}</span> 人共同记录那段集体记忆
        </div>
      </div>

      {/* Event hours */}
      <div className="pb-[30px]">
        <div className="mb-[10px]">
          在 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventMostHourName ?? 'event_most_hour_name')}</span> 那段时间 你在知乎停留了 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(eventMostHour ?? 'event_most_hour')}</span> 小时
        </div>
      </div>

      {/* Collected but not viewed */}
      <div className="text-sm">
        <div className="mb-[10px]">
          还记得 XX 条收藏后再也没有看过的内容吗?
        </div>
        <div>
          内容标题——XXX 等你来探索
        </div>
      </div>
    </BaseScene>
  );
}

