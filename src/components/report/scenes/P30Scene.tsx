'use client';

import Image from 'next/image';
import { useState } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import { setVoteOption } from '@/api/report';
import { useToast } from '@/context/toast-context';
import { useUserReportData } from '@/context/user-report-data-context';
import { summaryFlags } from '@/utils/common';
import GlitchLayer from '../effects/GlitchLayer';
import { useZA } from '@/hooks/useZA';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { isZhihuApp } from '@/lib/zhihu-detection';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  sceneName?: string;
}

interface ZhihuHybridAction {
  dispatch(params: Record<string, unknown>): Promise<unknown>;
}

interface ZhihuHybridNewAPI {
  (action: string): ZhihuHybridAction;
}

export default function P30Scene({ onNext, sceneName, onPrevious }: PageProps) {
  const { assets } = useAssets();
  const { showToast } = useToast();
  const { summaryPoster, reportData } = useUserReportData();
  const { trackEvent } = useZA();
  const { isAvailable: isHybridAvailable } = useZhihuHybrid();

  const [shareOptionKeys, setShareOptionKeys] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState(false);

  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const bgAsset = p28Assets.bg;
  const titleTransparent = p28Assets.titleTransparent;
  const flagsAssets = p28Assets.flags || {};
  const bannersAssets = p28Assets.banners || {};

  const handleSelect = (key: string) => {
    if (summaryPoster?.key === key) {
      showToast('请选择与正确答案不同的选项来迷惑');
      return;
    }

    if (shareOptionKeys.includes(key)) {
      setShareOptionKeys(shareOptionKeys.filter((k) => k !== key));
    } else {
      const newKyes = [...shareOptionKeys, key];
      setShareOptionKeys(newKyes.slice(-3));
    }
  };

  const handleShare = () => {
    if (shareOptionKeys.length < 3) {
      showToast('请任选三个选项');
      return;
    }

    trackEvent('', {
      moduleId: 'share_guess_button',
      type: 'Button',
      text: '*',
      page: {
        page_id: '60864',
      },
    });

    setVoteOption({
      poster_id: summaryPoster?.poster_id || 0,
      options: shareOptionKeys
        .map((i) => summaryFlags.find((flag) => flag.key === i)?.fullText || '')
        .filter(Boolean),
      is_publish_pin: isSynced ? 1 : 0,
    })
      .then(async (res) => {
        // Vote options set successfully
        // Note: poll_id would need to be retrieved separately if needed
        // Vote options set successfully, redirect to guess page
        if (res?.poll_id) {
          const baseShareUrl =
            process.env.NEXT_PUBLIC_BASE_SHARE_URL ||
            'https://event.zhihu.com/2025guess';
          const redirectUrl = `${baseShareUrl}/2025guess/?pollId=${res.poll_id}`;

          // Check if user is in zhihu app
          if (isZhihuApp() && isHybridAvailable && window.zhihuHybrid) {
            const shareHeadImg = process.env.NEXT_PUBLIC_CDN_BASE_URL + 'assets/share-head-img.png'
            try {
              const setShareInfoAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
                "share/setShareInfo"
              );

              await setShareInfoAction.dispatch({
                zhihuMessage: {
                  content: '猜猜哪一个是真实的我',
                  link: redirectUrl,
                },
                wechatTimeline: {
                  title: '猜猜哪一个是真实的我',
                  link: redirectUrl,
                  imgUrl: shareHeadImg,
                },
                wechatMessage: {
                  title: '猜猜哪一个是真实的我',
                  desc: '快来猜猜哪一个是真实的我',
                  link: redirectUrl,
                  imgUrl: shareHeadImg,
                },
                QQ: {
                  url: redirectUrl,
                  title: '猜猜哪一个是真实的我',
                  content: '快来猜猜哪一个是真实的我',
                  imageURL: shareHeadImg,
                },
                weibo: {
                  url: redirectUrl,
                  title: '猜猜哪一个是真实的我',
                  content: '快来猜猜哪一个是真实的我',
                  imageURL: shareHeadImg,
                },
                PosterShare: {
                  imageURL:redirectUrl,
                  pinContent: '猜猜哪一个是真实的我',
                },
                copyLink: {
                  content: redirectUrl,
                },
                Qzone: {
                  url: redirectUrl,
                  title: '猜猜哪一个是真实的我',
                  content: '快来猜猜哪一个是真实的我',
                  imageURL: shareHeadImg,
                }
              }); 

              // Use zhihuHybrid SDK to share the link
              const showActionSheetAction = (window.zhihuHybrid as ZhihuHybridNewAPI)("share/showShareActionSheet");
              await showActionSheetAction.dispatch({});
            } catch (error) {
              console.error('Failed to share via zhihuHybrid:', error);
              // If share fails, fallback to clipboard copy
              try {
                await navigator.clipboard.writeText(redirectUrl);
                showToast('分享失败，链接已复制到剪贴板', 'success');
              } catch (clipboardError) {
                console.error('Failed to copy to clipboard:', clipboardError);
                showToast('分享失败，请稍后重试', 'error');
              }
            }
          } else {
            // Not in zhihu app, copy to clipboard and show toast
            try {
              await navigator.clipboard.writeText(redirectUrl);
              showToast('链接已复制到剪贴板', 'success');
            } catch (clipboardError) {
              console.error('Failed to copy to clipboard:', clipboardError);
              showToast('复制链接失败，请稍后重试', 'error');
            }
            // Redirect after 3 seconds
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 3000);
          }
        } else {
          showToast('投票选项设置成功，但无法获取投票ID', 'error');
        }
      })
      .catch((error) => {
        console.error('Failed to set vote options:', error);
        showToast('设置投票选项失败，请重试', 'error');
      });
  };

  const handleSyncToggle = () => {
    setIsSynced(!isSynced);
  };

  const userName = reportData?.username as string | undefined;
  return (
    <BaseScene
      onNext={onNext}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      <GlitchLayer>
        <Image
          className='absolute'
          style={{ left: 0, top: 498 }}
          src={p28Assets.bg4.url}
          alt={p28Assets.bg4.alt}
          width={p28Assets.bg4.width}
          height={p28Assets.bg4.height}
        />
        <Image
          className='absolute'
          style={{ right: 20, bottom: 20 }}
          src={p28Assets.bg6.url}
          alt={p28Assets.bg6.alt}
          width={p28Assets.bg6.width}
          height={p28Assets.bg6.height}
        />
        <Image
          className='absolute left-0'
          style={{ top: 53 }}
          src={p28Assets.bg1.url}
          alt={p28Assets.bg1.alt}
          width={p28Assets.bg1.width}
          height={p28Assets.bg1.height}
        />

        <Image
          className='absolute right-0'
          style={{ top: 98 }}
          src={p28Assets.bg3.url}
          alt={p28Assets.bg3.alt}
          width={p28Assets.bg3.width}
          height={p28Assets.bg3.height}
        />
      </GlitchLayer>
      {/* content */}
      <div className='relative w-full h-full overflow-hidden'>
        <Image
          className='absolute left-1/2 -translate-x-1/2'
          style={{ top: 60 }}
          src={assets.kv.logo.url}
          alt={assets.kv.logo.alt}
          width={92}
          height={18}
        />

        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className='absolute z-[-2] w-auto h-full pointer-events-none select-none'
        />

        <Image
          src={titleTransparent.url}
          alt={titleTransparent.alt}
          width={330}
          height={113}
          className='relative mx-auto left-0 right-0 pointer-events-none select-none'
          style={{ top: 80 }}
        />
        {summaryPoster?.key &&
          (() => {
            const bannerAsset =
              bannersAssets[summaryPoster.key as keyof typeof bannersAssets];
            if (!bannerAsset) return null;
            return (
              <div
                className='relative'
                style={{ top: 150, gap: 22, left: 20, right: 20 }}
              >
                <Image
                  src={bannerAsset.active.url}
                  width={331}
                  height={77}
                  alt={bannerAsset.active.alt}
                />
                {summaryPoster?.key === 'empty' && (
                  <div className='absolute' style={{ left: 95, bottom: 0 }}>
                    <span style={{ fontSize: 44 }}>{summaryPoster.text}</span>
                    <span style={{ fontSize: 22, marginLeft: 2 }}>了</span>
                  </div>
                )}
              </div>
            );
          })()}

        <div
          className='relative flex justify-center items-center bg-[#000] text-white'
          style={{
            top: 30,
            borderRadius: 24,
            margin: '0 auto',
            padding: '3px 8px',
            width: 'max-content',
          }}
        >
          @{userName} 的 2025
        </div>
        <div
          className='relative'
          style={{ top: 130, gap: 22, left: 20, right: 20 }}
        >
          任选三个「迷惑好友」
        </div>

        <div
          className='relative flex flex-wrap'
          style={{ top: 140, gap: 22, left: 20, right: 20 }}
        >
          {summaryFlags.map((item) => {
            const flagAsset = flagsAssets[item.key as keyof typeof flagsAssets];
            if (!flagAsset) return null;

            const isActive = shareOptionKeys.includes(item.key);
            const stateAsset = isActive ? flagAsset.active : flagAsset.grey;

            return (
              <Image
                onClick={() => handleSelect(item.key)}
                src={stateAsset.url}
                key={item.key}
                alt={stateAsset.alt}
                width={98}
                height={50}
              />
            );
          })}
        </div>

        <button
          className='absolute left-1/2 -translate-x-1/2 z-60 rounded-full bg-[#000] text-white text-lg'
          style={{
            minWidth: '264px',
            bottom: 100,
            height: 43,
          }}
          onClick={handleShare}
        >
          分享给好友猜猜
        </button>
        <label
          className='flex items-center gap-2 cursor-pointer'
          style={{
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
          }}
        >
          <div className='relative'>
            <input
              type='checkbox'
              checked={isSynced}
              onChange={handleSyncToggle}
              className='sr-only'
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                isSynced
                  ? 'bg-[#00ADE9] border-[#00ADE9]'
                  : 'bg-white/90 border-[#000]/30'
              }`}
            >
              {isSynced && (
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 6L9 17L4 12'
                    stroke='white'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </div>
          </div>
          <span className='text-[12px] text-black font-normal'>
            同步至想法，评论@好友赢周边
          </span>
        </label>

        <Image
          className='absolute'
          onClick={onPrevious}
          style={{ bottom: 27, left: 20 }}
          src={p28Assets.bg9.url}
          alt={p28Assets.bg9.alt}
          width={p28Assets.bg9.width}
          height={p28Assets.bg9.height}
        />
      </div>
    </BaseScene>
  );
}
