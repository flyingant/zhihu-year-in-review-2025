"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P5Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();

  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue2Asset = bgAsset.blue2;
  const mix3Asset = bgAsset.mix3;
  const mix5Asset = bgAsset.mix5;
  const mix6Asset = bgAsset.mix6;

  const liukanshanPixelAsset = assets.report.p2.liukanshan;
  const hiAsset = assets.report.p5.hi;
  const yellowMirrorAsset = assets.report.p5.yellowMirror;
  const liukanshanAsset = assets.report.p5.liukanshan;

  
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
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={mix6Asset.url} alt="{mix6Asset.alt}" width={mix6Asset.width} height={mix6Asset.height} 
          className="object-contain absolute -top-[95px] left-[-8px] pointer-events-none select-none z-1" />
        <Image src={mix3Asset.url} alt="{mix3Asset.alt}" width={mix3Asset.width} height={mix3Asset.height} 
          className="object-contain absolute top-[35px] right-[0px] pointer-events-none select-none z-1" />
        <Image src={blue2Asset.url} alt="{blue2Asset.alt}" width={blue2Asset.width} height={blue2Asset.height} 
          className="object-contain absolute bottom-[267px] right-[56px] pointer-events-none select-none z-1" />
        <Image src={mix5Asset.url} alt="{mix5Asset.alt}" width={mix5Asset.width} height={mix5Asset.height} 
          className="object-contain absolute bottom-[8px] right-[-20px] pointer-events-none select-none z-1" />
      </div>
      <div className="z-1">
        <Image 
          src={yellowMirrorAsset.url} 
          alt={yellowMirrorAsset.alt} 
          width={yellowMirrorAsset.width} 
          height={yellowMirrorAsset.height} 
          className="object-contain absolute bottom-[49px] left-[0] pointer-events-none select-none z-1" 
        />
        <Image 
          src={liukanshanPixelAsset.url} 
          alt={liukanshanPixelAsset.alt} 
          width={liukanshanPixelAsset.width} 
          height={liukanshanPixelAsset.height} 
          className="object-contain absolute bottom-[73px] left-[26px]  pointer-events-none select-none z-1" 
        />
        <Image 
          src={hiAsset.url} 
          alt={hiAsset.alt} 
          width={hiAsset.width} 
          height={hiAsset.height} 
          className="object-contain absolute bottom-[203px] left-[126px] pointer-events-none select-none z-1" 
        />
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute bottom-[53px] right-[28px] pointer-events-none select-none z-1" 
        />
      </div>
      <div className={typographyClass('title') + ' mb-[60px]'}>
        这一年，你真心分享
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
        你发布了 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{pinCount ?? 'publish_pin_cnt'}</span> 条想法
        <div className="mt-[10px]">
          其中「<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{hotPinTitle ?? 'hot_pin_title'}</span>」
          <div>折射出最多共鸣</div>
        </div>
      </div>
    </BaseScene>
  );
}