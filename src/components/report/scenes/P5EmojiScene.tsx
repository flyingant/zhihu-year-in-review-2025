'use client';

import { useUserReportData } from '@/context/user-report-data-context';
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

export default function P5EmojiScene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
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
  const p5GifAsset = assets.report.p5.gif;
  const threeDHiAsset = assets.report.p5['3dHi'];

  const emojiName = reportData?.emoji_name ?? '';
  const emojiCount = reportData?.emoji_cnt ?? null;
  const discussMemberName = reportData?.comment_discuss_member_name ?? null;
  const discussCount = reportData?.comment_discuss_cnt ?? null;

  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      <GlitchLayer>
        <Image
          src={mix6Asset.url}
          alt=''
          width={mix6Asset.width}
          height={mix6Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '15px', left: '-8px' }}
        />
        <Image
          src={mix3Asset.url}
          alt=''
          width={mix3Asset.width}
          height={mix3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', right: '0px' }}
        />
        <Image
          src={blue2Asset.url}
          alt=''
          width={blue2Asset.width}
          height={blue2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '267px', right: '56px' }}
        />
        <Image
          src={mix5Asset.url}
          alt=''
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '8px', right: '-20px' }}
        />
      </GlitchLayer>

      <div className='z-1'>
        <Image
          src={yellowMirrorAsset.url}
          alt=''
          width={yellowMirrorAsset.width}
          height={yellowMirrorAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '49px', left: '0px' }}
        />
        <Image
          src={liukanshanPixelAsset.url}
          alt=''
          width={liukanshanPixelAsset.width}
          height={liukanshanPixelAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '73px', left: '26px' }}
        />
        <Image
          src={hiAsset.url}
          alt=''
          width={hiAsset.width}
          height={hiAsset.height}
          className='animate-mirror-vanish object-contain absolute pointer-events-none select-none z-1'
          style={{
            bottom: '203px',
            left: '126px',
            animationDelay: '1s',
            transformOrigin: 'bottom left',
          }}
        />
        <Image
          src={p5GifAsset.url}
          alt=''
          width={p5GifAsset.width}
          height={p5GifAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '46px', right: '20px' }}
        />
        <Image
          src={threeDHiAsset.url}
          alt=''
          width={threeDHiAsset.width}
          height={threeDHiAsset.height}
          className='opacity-0 animate-3d-pop object-contain absolute pointer-events-none select-none z-1'
          style={{
            bottom: '212px',
            right: '93px',
            animationDelay: '2s',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      <div
        style={{
          paddingLeft: '34px',
          paddingRight: '34px',
          paddingTop: '120px',
          fontSize: '16px',
        }}
      >
        <div style={{ fontSize: '22px', marginBottom: '46px' }}>
          这一年，你真心分享
        </div>

        <div
          style={{ marginBottom: '10px' }}
          hidden={!emojiName || !emojiCount || emojiCount < 2}
        >
          <div
            style={{ marginBottom: '10px' }}
            className='flex items-center flex-wrap'
          >
            你的年度表情是{' '}
            <Image
              src={emojiName}
              alt=''
              width={50}
              height={50}
              style={{ padding: '0 6px' }}
            />
            ，共出现了
            <span
              className={`text-r-yellow`}
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                fontSize: '18px',
              }}
            >
              {emojiCount}
            </span>
            次
          </div>
          <div></div>
        </div>

        <div
          style={{ marginBottom: '20px', lineHeight: '32px' }}
          hidden={!discussMemberName || !discussCount || discussCount < 3}
        >
          这一年，你和
          <span
            className={`text-r-pink`}
            style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              fontSize: '18px',
            }}
          >
            @{discussMemberName}
          </span>
          <div>在评论区讨论最多</div>
          <div style={{ marginTop: '4px' }}>
            那场思维碰撞，至今回想仍有余温。
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
