"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

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
  const hotCommentLikes = reportData?.hot_comment_uv ?? 0;
  const pinCount = reportData?.publish_pin_cnt ?? null;
  const hotPinTitle = reportData?.hot_pin_title ?? null;
  const hotPinLikes = reportData?.hot_pin_uv ?? 0; // Not used in JSX, commented out
  // const emojiName = reportData?.emoji_name ?? null; // Not used in JSX, commented out
  // const emojiCount = reportData?.emoji_cnt ?? null; // Not used in JSX, commented out
  // const discussMemberName = reportData?.comment_discuss_member_name ?? null; // Not used in JSX, commented out
  // const discussCount = reportData?.comment_discuss_cnt ?? null; // Not used in JSX, commented out

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image 
          src={mix6Asset.url} 
          alt={mix6Asset.alt} 
          width={mix6Asset.width} 
          height={mix6Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '15px', left: '-8px' }}
        />
        <Image 
          src={mix3Asset.url} 
          alt={mix3Asset.alt} 
          width={mix3Asset.width} 
          height={mix3Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', right: '0px' }}
        />
        <Image 
          src={blue2Asset.url} 
          alt={blue2Asset.alt} 
          width={blue2Asset.width} 
          height={blue2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '267px', right: '56px' }}
        />
        <Image 
          src={mix5Asset.url} 
          alt={mix5Asset.alt} 
          width={mix5Asset.width} 
          height={mix5Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '8px', right: '-20px' }}
        />
      </GlitchLayer>

      <div className="z-1">
        <Image 
          src={yellowMirrorAsset.url} 
          alt={yellowMirrorAsset.alt} 
          width={yellowMirrorAsset.width} 
          height={yellowMirrorAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '49px', left: '0px' }}
        />
        <Image 
          src={liukanshanPixelAsset.url} 
          alt={liukanshanPixelAsset.alt} 
          width={liukanshanPixelAsset.width} 
          height={liukanshanPixelAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '73px', left: '26px' }}
        />
        <Image 
          src={hiAsset.url} 
          alt={hiAsset.alt} 
          width={hiAsset.width} 
          height={hiAsset.height} 
          className="opacity-0 animate-pop-bubble object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '203px', left: '126px', animationDelay: '1.5s', transformOrigin: 'bottom left' }}
        />
        <Image 
          src={liukanshanAsset.url} 
          alt={liukanshanAsset.alt} 
          width={liukanshanAsset.width} 
          height={liukanshanAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '53px', right: '28px' }}
        />
      </div>

      <div className="text-[14px]" style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div className={typographyClass('title')} style={{ marginBottom: '46px' }}>
          这一年，你真心分享
        </div>

        {/* 评论统计 */}
        <div style={{ marginBottom: '40px' }} hidden={!commentCount}>
          你留下了 
          <span 
            className={`text-r-pink text-[19px]`}
            style={{ paddingLeft: '6px', paddingRight: '6px' }}
          >
            {commentCount}
          </span> 
          条评论
          
          {/* 最热评论 */}
          <div style={{ marginTop: '10px' }} hidden={!hotCommentContent || hotCommentLikes < 10 || !hotCommentLikes}>
            <div>
              最热一条
              <span 
                className={`text-r-yellow text-[19px]`}
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
              >
                「{hotCommentContent}」
              </span>
            </div>
            
            <div>
              收获了 
              <span 
                className={`text-r-purple ${typographyClass('highlight')}`}
                style={{ paddingLeft: '6px', paddingRight: '6px' }}
              >
                {hotCommentLikes}
              </span> 
              人的点赞
            </div>
             
          </div>
        </div>

        {/* 想法统计 */}
        <div style={{ marginBottom: '20px' }} hidden={!pinCount}>
          你发布了
          <span 
            className={`text-r-pink text-[19px]`}
            style={{ paddingLeft: '6px', paddingRight: '6px' }}
          >
            {pinCount}
          </span> 
          条想法
          <div className="leading-[32px]" style={{ marginTop: '10px' }} hidden={!hotPinTitle || hotPinLikes < 10 || !hotPinLikes}>
            其中
            <span 
              className={`text-r-green text-[19px]`}
              style={{ paddingLeft: '2px', paddingRight: '2px' }}
            >
              「{hotPinTitle}」
            </span>
            <div>折射出最多共鸣</div>
          </div>
        </div>
      </div>
      
    </BaseScene>
  );
}