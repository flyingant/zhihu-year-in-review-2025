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

export default function P7Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const liukanshanAsset = assets.report.p7.liukanshan;
  const blueBubbleAsset = assets.report.p7.blueBubble;
  const redBubbleAsset = assets.report.p7.redBubble;
  const yellowBubbleAsset = assets.report.p7.yellowBubble;
  
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
      <GlitchLayer>
        <Image 
          src={blue1Asset.url} 
          alt={blue1Asset.alt} 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '20px', right: '36px' }}
        />
        <Image 
          src={mix2Asset.url} 
          alt={mix2Asset.alt} 
          width={mix2Asset.width} 
          height={mix2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '152px', left: '0px' }}
        />
        <Image 
          src={mix5Asset.url} 
          alt={mix5Asset.alt} 
          width={mix5Asset.width} 
          height={mix5Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '20px', right: '74px' }}
        />
      </GlitchLayer>

      <div style={{ paddingLeft: '34px', paddingRight: '34px', paddingTop: '120px' }}>
        <div className={typographyClass('title')} style={{ marginBottom: '40px' }}>
          这一年，你真心分享
        </div>

        <div style={{ fontSize: '16px', lineHeight: '32px', marginBottom: '20px', display: 'flex' }}>
          {/* Bubble 图片作为左侧装饰或者容器 */}
          <div style={{ marginRight: '10px', flexShrink: 0 }}>
             <Image 
              src={blueBubbleAsset.url} 
              alt={blueBubbleAsset.alt} 
              width={blueBubbleAsset.width} 
              height={blueBubbleAsset.height} 
              className="object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog" 
            />
          </div>
          
          <div>
            <div>你的内容收获了</div>
            <div>
              <span 
                className={`${colorClass('blue')}`} 
                style={{ fontSize: '20px', paddingLeft: '4px', paddingRight: '4px' }}
              >
                {readCount ?? 'content_pv_cnt'}
              </span> 
              次阅读
            </div>
            <div>
              <span 
                className={`${colorClass('fern')}`} 
                style={{ fontSize: '20px', paddingRight: '4px' }}
              >
                {upvoteCount ?? 'content_upvote_cnt'}
              </span> 
              个赞同
            </div>
            <div>
              <span 
                className={`${colorClass('pink')}`} 
                style={{ fontSize: '20px', paddingRight: '4px' }}
              >
                {collectCount ?? 'content_collect_cnt'}
              </span> 
              次收藏
            </div>
            <div>
              <span 
                className={`${colorClass('blue')}`} 
                style={{ fontSize: '20px', paddingRight: '4px' }}
              >
                {commentCount ?? 'content_comment_cnt'}
              </span> 
              条评论
            </div>
            <div>
              <span 
                className={`${colorClass('fern')}`} 
                style={{ fontSize: '20px', paddingRight: '4px' }}
              >
                {shareCount ?? 'content_share_cnt'}
              </span> 
              次分享
            </div>
            <div>这些回声，将你的声音推向更远的地方</div>
          </div>
        </div>

        {/* 刘看山图片 */}
        <div className="flex justify-between" style={{ margin: '20px 0' }}>
          <div>
            <Image 
              src={yellowBubbleAsset.url} 
              alt={yellowBubbleAsset.alt} 
              width={yellowBubbleAsset.width} 
              height={yellowBubbleAsset.height} 
              className="relative object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog" 
              style={{ left: '38px' }}
            />
            <Image 
              src={redBubbleAsset.url} 
              alt={redBubbleAsset.alt} 
              width={redBubbleAsset.width} 
              height={redBubbleAsset.height} 
              className="relative object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog" 
              style={{ left: '-12px', bottom: '-20px' }}
            />
          </div>
          <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
            className="relative object-contain pointer-events-none select-none z-1" 
            style={{ right: '-20px' }}
          />
        </div>

        <div style={{ fontSize: '15px', lineHeight: '28px' }}>
          <div>
            你走进了 
            <span 
              className={`${colorClass('blue')}`} 
              style={{ fontSize: '20px', paddingLeft: '2px', paddingRight: '2px' }}
            >
              {roundTableCount ?? 'roundtable_cnt'}
            </span> 
            个圆桌讨论
          </div>
          <div>
            有 
            <span 
              className={`${colorClass('pink')}`} 
              style={{ fontSize: '20px', paddingLeft: '2px', paddingRight: '2px' }}
            >
              {editorPickCount ?? 'recommended_cnt'}
            </span> 
            篇内容被「编辑推荐」
          </div>
        </div>
      </div>
    </BaseScene>
  );
}