'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import { colorClass, typographyClass } from '@/hooks/useSceneTheme';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P7Scene({ onNext, onPrevious, onNavigateToScene, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue1Asset = bgAsset.blue1;
  const mix5Asset = bgAsset.mix5;
  const mix2Asset = bgAsset.mix2;
  const p7GifAsset = assets.report.p7.gif;
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
    <BaseScene onNext={onNext} onPrevious={onPrevious} onNavigateToScene={onNavigateToScene} sceneName={sceneName}>
      <GlitchLayer>
        <Image
          src={blue1Asset.url}
          alt={blue1Asset.alt}
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '20px', right: '36px' }}
        />
        <Image
          src={mix2Asset.url}
          alt={mix2Asset.alt}
          width={mix2Asset.width}
          height={mix2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', left: '0px' }}
        />
        <Image
          src={mix5Asset.url}
          alt={mix5Asset.alt}
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '20px', right: '74px' }}
        />
      </GlitchLayer>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '120px',
          fontSize: '14px',
        }}
      >
        <div
          className='text-center'
          style={{ marginBottom: '40px', fontSize: '22px' }}
        >
          真诚的文字值得被认真回应
        </div>

        <div
          style={{
            lineHeight: '32px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '12px' }}>
            <Image
              src={blueBubbleAsset.url}
              alt={blueBubbleAsset.alt}
              width={blueBubbleAsset.width}
              height={blueBubbleAsset.height}
              className='object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog relative'
              style={{ left: '-10px', paddingBottom: '10px' }}
            />
          </div>

          <div className='text-center'>
            <div className='text-center'>你的内容收获了</div>
            <div hidden={!readCount}>
              <span
                className='text-r-pink'
                style={{
                  fontSize: '18px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
              >
                {readCount}
              </span>
              次阅读
            </div>
            <div hidden={!upvoteCount}>
              <span
                className='text-r-fern'
                style={{ fontSize: '18px', paddingRight: '4px' }}
              >
                {upvoteCount}
              </span>
              个赞同
            </div>
            <div hidden={!collectCount}>
              <span
                className='text-r-blue'
                style={{ fontSize: '18px', paddingRight: '4px' }}
              >
                {collectCount}
              </span>
              次收藏
            </div>
            <div hidden={!commentCount}>
              <span
                className='text-r-purple'
                style={{ fontSize: '18px', paddingRight: '4px' }}
              >
                {commentCount}
              </span>
              条评论
            </div>
            <div hidden={!shareCount}>
              <span
                className='text-r-yellow'
                style={{ fontSize: '18px', paddingRight: '4px' }}
              >
                {shareCount}
              </span>
              次分享
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: '40px' }}>
          这些回声，将你的声音推向更远的地方
        </div>

        {/* 刘看山图片 */}
        <div className='flex justify-between' style={{ margin: '20px 0' }}>
          <div>
            <Image
              src={yellowBubbleAsset.url}
              alt={yellowBubbleAsset.alt}
              width={yellowBubbleAsset.width}
              height={yellowBubbleAsset.height}
              className='relative object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog'
              style={{ left: '38px' }}
            />
            <Image
              src={redBubbleAsset.url}
              alt={redBubbleAsset.alt}
              width={redBubbleAsset.width}
              height={redBubbleAsset.height}
              className='relative object-contain pointer-events-none select-none z-1 opacity-0 origin-bottom-left animate-pop-dialog'
              style={{ left: '-12px', bottom: '-20px' }}
            />
          </div>
          <Image
            src={p7GifAsset.url}
            alt={p7GifAsset.alt}
            width={p7GifAsset.width}
            height={p7GifAsset.height}
            className='relative object-contain pointer-events-none select-none z-1'
            style={{ right: '-20px' }}
            unoptimized
          />
        </div>

        <div
          style={{ fontSize: '14px', lineHeight: '28px', top: '-40px' }}
          className='relative'
          hidden={!roundTableCount && !editorPickCount}
        >
          <div hidden={!roundTableCount}>
            你走进了
            <span
              className='text-r-blue'
              style={{
                fontSize: '18px',
                paddingLeft: '4px',
                paddingRight: '4px',
              }}
            >
              {roundTableCount}
            </span>
            个圆桌讨论
          </div>
          <div hidden={!editorPickCount}>
            有
            <span
              className='text-r-yellow'
              style={{
                fontSize: '18px',
                paddingLeft: '4px',
                paddingRight: '4px',
              }}
            >
              {editorPickCount}
            </span>
            篇内容被「编辑推荐」
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
