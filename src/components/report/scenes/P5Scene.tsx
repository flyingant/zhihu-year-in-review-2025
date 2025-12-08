"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P5Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P5 spec
  const commentCount = reportData?.publish_comment_cnt ?? null;
  const hotCommentContent = reportData?.hot_comment_content ?? null;
  const hotCommentLikes = reportData?.hot_comment_uv ?? null;
  const pinCount = reportData?.publish_pin_cnt ?? null;
  const hotPinTitle = reportData?.hot_pin_title ?? null;
  const hotPinLikes = reportData?.hot_pin_uv ?? null;
  const emojiName = reportData?.emoji_name ?? null;
  const emojiCount = reportData?.emoji_cnt ?? null;
  const discussMemberName = reportData?.comment_discuss_member_name ?? null;
  const discussCount = reportData?.comment_discuss_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' mb-[60px]'}>
        不算太长的字句，都留下痕迹
      </div>

      {/* 评论统计 */}
      <div className="mb-[20px]">
        你留下了 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{commentCount ?? 'publish_comment_cnt'}</span> 条评论
        {/* 最热评论 */}
        <div className="mt-[10px]">
          最热一条「<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{hotCommentContent ?? 'hot_comment_content'}</span>」，收获了 <span className={`${colorClass('pink')} ${typographyClass('highlight')} px-[5px]`}>{hotCommentLikes ?? 'hot_comment_uv'}</span> 人的点赞
        </div>
      </div>

      {/* 想法统计 */}
      <div className="mb-[20px]">
        发布了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{pinCount ?? 'publish_pin_cnt'}</span> 条想法
        <div className="mt-[10px]">
          最热一条「<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{hotPinTitle ?? 'hot_pin_title'}</span>」，收获了 <span className={`${colorClass('pink')} ${typographyClass('highlight')} px-[5px]`}>{hotPinLikes ?? 'hot_pin_uv'}</span> 人的点赞
        </div>
      </div>

      {/* 表情统计 */}
      <div className="mb-[20px]">
        你的年度表情是「<span className={`${colorClass('yellow')} ${typographyClass('subtitle')} px-[2px]`}>{emojiName ?? 'emoji_name'}</span>」，共出现了 <span className={`${colorClass('yellow')} ${typographyClass('subtitle')} px-[2px]`}>{emojiCount ?? 'emoji_cnt'}</span> 次
      </div>

      {/* 评论区交锋 */}
      <div className="leading-relaxed">
        你和 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>@{discussMemberName ?? 'comment_discuss_member_name'}</span> 在评论区交锋了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{discussCount ?? 'comment_discuss_cnt'}</span> 轮
      </div>
    </BaseScene>
  );
}