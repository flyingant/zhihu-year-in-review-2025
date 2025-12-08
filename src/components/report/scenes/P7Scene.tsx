"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P7Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P7 spec
  const readCount = reportData?.content_pv_cnt ?? null;
  const upvoteCount = reportData?.content_upvote_cnt ?? null;
  const collectCount = reportData?.content_collect_cnt ?? null;
  const commentCount = reportData?.content_comment_cnt ?? null;
  const shareCount = reportData?.content_share_cnt ?? null;
  const roundTableCount = reportData?.roundtable_cnt ?? null;
  const editorPickCount = reportData?.recommended_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' mb-[40px]'}>
        真诚的文字值得被认真回应
      </div>

      <div className="text-[16px] leading-[32px] mb-[180px]">
        <div>
          这一年，你的内容收获了 <span className={`${colorClass('blue')} text-[20px] px-[4px]`}>{readCount ?? 'content_pv_cnt'}</span> 次阅读
        </div>
        <div>
          <span className={`${colorClass('fern')} text-[20px] pr-[4px]`}>{upvoteCount ?? 'content_upvote_cnt'}</span> 个赞同
        </div>
        <div>
          <span className={`${colorClass('pink')} text-[20px] pr-[4px]`}>{collectCount ?? 'content_collect_cnt'}</span> 次收藏
        </div>
        <div>
          <span className={`${colorClass('blue')} text-[20px] pr-[4px]`}>{commentCount ?? 'content_comment_cnt'}</span> 条评论
        </div>
        <div>
          <span className={`${colorClass('fern')} text-[20px] pr-[4px]`}>{shareCount ?? 'content_share_cnt'}</span> 次分享
        </div>
      </div>

      <div className="text-[15px] leading-[28px]">
        <div>
          你走进了 <span className={`${colorClass('blue')} text-[20px] px-[2px]`}>{roundTableCount ?? 'roundtable_cnt'}</span> 个圆桌讨论
        </div>
        <div>
          有 <span className={`${colorClass('pink')} text-[20px] px-[2px]`}>{editorPickCount ?? 'recommended_cnt'}</span> 篇内容被「编辑推荐」
        </div>
      </div>
    </BaseScene>
  );
}