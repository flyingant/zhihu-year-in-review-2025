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

export default function P7Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const liukanshanAsset = assets.report.p7.liukanshan;
  const bubbleAsset = assets.report.p7.bubble;
  
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
      <div className="z-0">
        {/* 顺序从上到下 */}
        <Image src={blue1Asset.url} alt="{blue1Asset.alt}" width={blue1Asset.width} height={blue1Asset.height} 
          className="object-contain absolute top-[20px] right-[36px] pointer-events-none select-none z-1" />
        <Image src={mix2Asset.url} alt="{mix2Asset.alt}" width={mix2Asset.width} height={mix2Asset.height} 
          className="object-contain absolute top-[152px] left-[0px] pointer-events-none select-none z-1" />
        <Image src={mix5Asset.url} alt="{mix5Asset.alt}" width={mix5Asset.width} height={mix5Asset.height} 
          className="object-contain absolute bottom-[20] right-[74px] pointer-events-none select-none z-1" />
      </div>
      <div className="px-[34px] pt-[120px] ">
        <div className={typographyClass('title') + ' mb-[40px]'}>
          这一年，你真心分享
        </div>

        <div className="text-[16px] leading-[32px] mb-[20px] flex">
          <Image 
            src={bubbleAsset.url} 
            alt={bubbleAsset.alt} 
            width={bubbleAsset.width} 
            height={bubbleAsset.height} 
            className="object-contain pointer-events-none select-none z-1" 
          />
          <div>
            <div>
              你的内容收获了
            </div>
            <div>
              <span className={`${colorClass('blue')} text-[20px] px-[4px]`}>{readCount ?? 'content_pv_cnt'}</span> 次阅读
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
            <div>这些回声，将你的声音推向更远的地方</div>
          </div>
          
        </div>
        <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
            className="object-contain pointer-events-none select-none z-1" 
          />
        <div className="text-[15px] leading-[28px]">
          <div>
            你走进了 <span className={`${colorClass('blue')} text-[20px] px-[2px]`}>{roundTableCount ?? 'roundtable_cnt'}</span> 个圆桌讨论
          </div>
          <div>
            有 <span className={`${colorClass('pink')} text-[20px] px-[2px]`}>{editorPickCount ?? 'recommended_cnt'}</span> 篇内容被「编辑推荐」
          </div>
        </div>
      </div>

    </BaseScene>
  );
}