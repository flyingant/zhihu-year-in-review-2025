'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { truncateText } from '@/utils/common';

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
  const p5GifAsset = assets.report.p5.gif;

  // Map context data to component variables according to P5 spec
  const commentCount = reportData?.publish_comment_cnt ?? null;
  const hotCommentContent = truncateText(
    reportData?.hot_comment_content ?? '',
    28
  );
  const hotCommentLikes = reportData?.hot_comment_uv ?? 0;
  const pinCount = reportData?.publish_pin_cnt ?? null;
  const hotPinTitle = truncateText(reportData?.hot_pin_title ?? '', 28);
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
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '15px', left: '-8px' }}
        />
        <Image
          src={mix3Asset.url}
          alt={mix3Asset.alt}
          width={mix3Asset.width}
          height={mix3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', right: '0px' }}
        />
        <Image
          src={blue2Asset.url}
          alt={blue2Asset.alt}
          width={blue2Asset.width}
          height={blue2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '267px', right: '56px' }}
        />
        <Image
          src={mix5Asset.url}
          alt={mix5Asset.alt}
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '8px', right: '-20px' }}
        />
      </GlitchLayer>

      <div className='z-1'>
        <Image
          src={yellowMirrorAsset.url}
          alt={yellowMirrorAsset.alt}
          width={yellowMirrorAsset.width}
          height={yellowMirrorAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '49px', left: '0px' }}
        />
        <Image
          src={liukanshanPixelAsset.url}
          alt={liukanshanPixelAsset.alt}
          width={liukanshanPixelAsset.width}
          height={liukanshanPixelAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '73px', left: '26px' }}
        />
        <Image
          src={hiAsset.url}
          alt={hiAsset.alt}
          width={hiAsset.width}
          height={hiAsset.height}
          className='opacity-0 animate-pop-bubble object-contain absolute pointer-events-none select-none z-1'
          style={{
            bottom: '203px',
            left: '126px',
            animationDelay: '1.5s',
            transformOrigin: 'bottom left',
          }}
        />
        <Image
          src={p5GifAsset.url}
          alt={p5GifAsset.alt}
          width={p5GifAsset.width}
          height={p5GifAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '53px', right: '28px' }}
          unoptimized
        />
      </div>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '120px',
          fontSize: '14px',
        }}
      >
        <div style={{ fontSize: '22px', marginBottom: '46px' }}>
          不算太长的字句，都留下痕迹
        </div>

        {/* 评论统计 */}
        <div hidden={!commentCount}>
          你留下了
          <span
            className={`text-r-pink`}
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '18px',
            }}
          >
            {commentCount}
          </span>
          条评论
          {/* 最热评论 */}
          <div
            style={{
              marginTop: '10px',
              marginBottom: '40px',
              lineHeight: '32px',
            }}
            hidden={
              !hotCommentContent || hotCommentLikes < 10 || !hotCommentLikes
            }
          >
            <div>
              最热一条
              <span
                className={`text-r-yellow`}
                style={{
                  paddingLeft: '2px',
                  paddingRight: '2px',
                  fontSize: '18px',
                }}
              >
                {truncateText(hotCommentContent)}
              </span>
            </div>

            <div>
              收获了
              <span
                className={`text-r-purple`}
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  fontSize: '24px',
                }}
              >
                {hotCommentLikes}
              </span>
              人的点赞和回复
            </div>
          </div>
        </div>

        {/* 想法统计 */}
        <div style={{ marginBottom: '20px' }} hidden={!pinCount}>
          你发布了
          <span
            className={`text-r-pink`}
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '18px',
            }}
          >
            {pinCount}
          </span>
          条想法
          <div
            className='leading-[32px]'
            style={{ marginTop: '10px' }}
            hidden={!hotPinTitle || hotPinLikes < 10 || !hotPinLikes}
          >
            其中
            <span
              className={`text-r-green`}
              style={{
                paddingLeft: '2px',
                paddingRight: '2px',
                fontSize: '18px',
              }}
            >
              {truncateText(hotPinTitle)}
            </span>
            <div>
              获得了
              <span
                className='text-r-green'
                style={{ margin: '0 4px', fontSize: '16px' }}
              >
                {hotPinLikes}
              </span>{' '}
              次回应
            </div>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
