'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useToast } from '@/context/toast-context';
import { isZhihuApp } from '@/lib/zhihu-detection';
import { useMobile } from '@/hooks/useMobile';
import { publishSummaryPoster } from '@/api/report';
import { useZA } from '@/hooks/useZA';

// Type for Zhihu Hybrid SDK
interface ZhihuHybridAction {
  dispatch(params: Record<string, unknown>): Promise<unknown>;
}

interface ZhihuHybridNewAPI {
  (action: string): ZhihuHybridAction;
}

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P29Scene({ onNext, sceneName }: PageProps) {
  const { summaryPoster } = useUserReportData();
  const { assets } = useAssets();
  const [isSynced, setIsSynced] = useState(false);
  const { trackEvent, trackPageShow } = useZA();
  const {
    downloadImage: downloadImageViaHybrid,
    isAvailable: isHybridAvailable,
  } = useZhihuHybrid();
  const { showToast } = useToast();
  const isMobile = useMobile();

  useEffect(() => {
    trackPageShow({ page: { page_id: '60864' } });
  }, []);

  if (!assets) return null;

  /**
   * 标准的图片下载方法（用于非知乎 App 环境）
   * 使用 canvas 方法绕过 CORS 限制
   */
  const downloadImageStandard = async (imageUrl: string) => {
    try {
      // 方法1: 尝试使用 canvas（需要服务器支持 CORS）
      const tryCanvasMethod = (): Promise<Blob> => {
        return new Promise<Blob>((resolve, reject) => {
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }

              ctx.drawImage(img, 0, 0);

              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to convert canvas to blob'));
                }
              }, 'image/png');
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () =>
            reject(new Error('Failed to load image with CORS'));
          img.src = imageUrl;
        });
      };

      // 方法2: 直接使用 fetch（如果 canvas 方法失败）
      const tryFetchMethod = async (): Promise<Blob> => {
        const response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        return await response.blob();
      };

      // 方法3: 使用代理或直接链接下载（最后的降级方案）
      const tryDirectDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `poster-${Date.now()}.png`;
        link.target = '_blank';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      let blob: Blob;

      try {
        // 首先尝试 canvas 方法
        blob = await tryCanvasMethod();
      } catch (canvasError) {
        console.warn('Canvas method failed, trying fetch:', canvasError);
        try {
          // 如果 canvas 失败，尝试 fetch
          blob = await tryFetchMethod();
        } catch (fetchError) {
          console.warn(
            'Fetch method failed, using direct download:',
            fetchError
          );
          // 如果都失败，使用直接下载（可能在某些浏览器中不工作）
          tryDirectDownload();
          return;
        }
      }

      // 如果成功获取到 blob，创建下载链接
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `poster-${Date.now()}.png`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      showToast('图片保存成功', 'success');
    } catch (error) {
      console.error('Failed to download image:', error);
      showToast('保存失败，请稍后重试', 'error');
    }
  };

  /**
   * 保存图片到本地
   * 如果在知乎 App 内，使用 zhihuHybrid SDK 下载图片
   * 否则使用标准的 JavaScript 下载方法
   */
  const handleSave = async () => {
    const posterUrl = summaryPoster?.poster_url;
    if (!posterUrl) {
      showToast('没有可保存的图片', 'error');
      return;
    }

    trackEvent('', {
      moduleId: 'annual_individual_report_result_save_picture_button',
      type: 'Button',
      text: '*',
      page: {
        page_id: '60864',
      },
    });

    // 检测是否在知乎 App 内
    if (isZhihuApp()) {
      try {
        // 在知乎 App 内，使用 Hybrid SDK 下载图片
        await downloadImageViaHybrid(posterUrl);
        // showToast('图片保存成功', 'success');
      } catch (error) {
        console.error('Failed to save image via zhihuHybrid:', error);
        // 如果 zhihuHybrid 失败，降级到标准下载方法
        await downloadImageStandard(posterUrl);
      }
    } else {
      // 不在知乎 App 内，使用标准下载方法
      await downloadImageStandard(posterUrl);
    }
  };

  const handleShare = async () => {
    const posterUrl = summaryPoster?.poster_url;
    if (!posterUrl) {
      showToast('没有可分享的图片', 'error');
      return;
    }

    trackEvent('', {
      moduleId: 'annual_report_share_image_button',
      type: 'Button',
      text: '*',
      page: {
        page_id: '60864',
      },
    });

    // 如果用户勾选了同步至想法赢徽章，先发布海报
    if (isSynced && summaryPoster?.poster_id) {
      try {
        await publishSummaryPoster({ poster_id: summaryPoster.poster_id });
        showToast('已同步至想法', 'success');
      } catch (error) {
        console.error('Failed to publish summary poster:', error);
        const errorMessage =
          error && typeof error === 'object' && 'msg' in error
            ? String(error.msg)
            : '同步失败，请稍后重试';
        showToast(errorMessage, 'error');
        return; // 如果发布失败，不继续分享流程
      }
    }

    // 如果不在知乎 App 内，复制链接到剪贴板
    if (!isZhihuApp()) {
      try {
        await navigator.clipboard.writeText(posterUrl);
        showToast('链接已复制到剪贴板', 'success');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // 降级方案：使用传统的复制方法
        try {
          const textArea = document.createElement('textarea');
          textArea.value = posterUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            showToast('链接已复制到剪贴板', 'success');
          } else {
            showToast('复制失败，请稍后重试', 'error');
          }
        } catch (fallbackError) {
          console.error('Fallback copy method failed:', fallbackError);
          showToast('复制失败，请稍后重试', 'error');
        }
      }
    } else {
      // 在知乎 App 内，使用 zhihuHybrid SDK 分享
      if (isHybridAvailable && window.zhihuHybrid) {
        try {

          const setShareInfoAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
            "share/setShareInfo"
          );

          await setShareInfoAction.dispatch({
            zhihuMessage: {
              content: '2025年度总结海报图片',
              link: summaryPoster.poster_url,
            },
            WechatTimelineInfo: {
              title: '2025年度总结海报图片',
              link: summaryPoster.poster_url,
              imgUrl: assets.report.p29?.shareHeadImg?.url,
            },
            WechatMessageInfo: {
              title: '2025年度总结海报图片',
              desc: '快来看看我的2025年度总结海报吧！',
              link: summaryPoster.poster_url,
              imgUrl: assets.report.p29?.shareHeadImg?.url,
            }
          })


          const showActionSheetAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
            "share/showShareActionSheet"
          );
          // 使用 zhihuHybrid SDK 的分享功能
          // 根据知乎 Hybrid SDK 文档，分享功能通常使用 'base/share' 或 'social/share'
          // const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
          //   "base/share"
          // );
          await showActionSheetAction.dispatch({
            url: posterUrl,
            title: "2025年度总结海报图片",
            description: "快来看看我的2025年度总结海报吧！",
            
          });
        } catch (error) {
          console.error('Failed to share via zhihuHybrid:', error);
          // 如果分享失败，降级到复制链接
          try {
            await navigator.clipboard.writeText(posterUrl);
            showToast('分享失败，链接已复制到剪贴板', 'success');
          } catch (clipboardError) {
            console.error('Failed to copy to clipboard:', clipboardError);
            showToast('分享失败，请稍后重试', 'error');
          }
        }
      } else {
        // 如果 Hybrid SDK 不可用，降级到复制链接
        try {
          await navigator.clipboard.writeText(posterUrl);
          showToast('链接已复制到剪贴板', 'success');
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError);
          showToast('复制失败，请稍后重试', 'error');
        }
      }
    }
  };

  const handleSyncToggle = () => {
    setIsSynced(!isSynced);
  };

  const handleFriendInteraction = () => {
    // TODO: Implement friend interaction functionality
    console.log('Friend interaction clicked');
    onNext && onNext();
  };

  return (
    <BaseScene
      onNext={onNext}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      {/* Poster display - fullscreen */}
      {summaryPoster ? (
        <div className='absolute inset-0 z-10'>
          <div className='relative w-full h-full'>
            <Image
              src={summaryPoster.poster_url}
              alt='Summary Poster'
              fill
              className='object-cover'
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div
          className='absolute z-0 leading-relaxed text-center'
          style={{
            fontSize: 14,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          暂无海报
        </div>
      )}

      {/* Action buttons area at the bottom */}
      <div
        className='absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-6 px-6'
        style={{
          background: summaryPoster?.bg,
        }}
      >
        {/* Friend Interaction button */}
        <button
          onClick={handleFriendInteraction}
          className='flex items-center justify-center gap-2 bg-black rounded-full text-center mb-4'
          style={{ width: '330px', height: '34px' }}
        >
          {assets.report.p29?.iconFriend && (
            <Image
              src={assets.report.p29.iconFriend.url}
              alt={assets.report.p29.iconFriend.alt}
              width={assets.report.p29.iconFriend.width / 2}
              height={assets.report.p29.iconFriend.height / 2}
              className='object-contain'
            />
          )}
          <span className='font-medium text-white' style={{ fontSize: '18px' }}>
            好友互动：猜猜哪个才是真的我？
          </span>
        </button>

        {/* Save and Share buttons */}
        <div className='flex gap-3 mb-4'>
          {/* Save button */}
          {!isMobile && (
            <button
              onClick={handleSave}
              className='flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center'
              style={{ width: '160px', height: '34px' }}
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 16V4M12 16L8 12M12 16L16 12'
                  stroke='#000'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4 20H20'
                  stroke='#000'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
              <span
                className='font-medium text-[#000]'
                style={{ fontSize: '18px' }}
              >
                保存
              </span>
            </button>
          )}

          {/* Share button */}
          <button
            onClick={handleShare}
            className='flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center'
            style={{ width: '160px', height: '34px' }}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='18'
                cy='5'
                r='3'
                stroke='#000'
                strokeWidth='2'
                fill='none'
              />
              <circle
                cx='6'
                cy='12'
                r='3'
                stroke='#000'
                strokeWidth='2'
                fill='none'
              />
              <circle
                cx='18'
                cy='19'
                r='3'
                stroke='#000'
                strokeWidth='2'
                fill='none'
              />
              <path
                d='M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49'
                stroke='#000'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            <span
              className='font-medium text-[#000]'
              style={{ fontSize: '18px' }}
            >
              分享
            </span>
          </button>
        </div>

        {/* Sync checkbox */}
        <label className='flex items-center gap-2 cursor-pointer'>
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
          <span className='text-black font-normal' style={{ fontSize: '18px' }}>
            同步至想法赢徽章
          </span>
        </label>
      </div>
    </BaseScene>
  );
}
