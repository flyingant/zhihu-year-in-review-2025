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
  const [isSynced, setIsSynced] = useState(true);
  const { trackEvent, trackPageShowWithUrl } = useZA();
  const {
    downloadImage: downloadImageViaHybrid,
    isAvailable: isHybridAvailable,
  } = useZhihuHybrid();
  const { showToast } = useToast();
  const isMobile = useMobile();

  useEffect(() => {
    trackPageShowWithUrl({ page: { page_id: '60864' } }, 'https://event.zhihu.com/2025/end/');
  }, []);

  if (!assets) return null;

  const {
    iconShare,
    iconSave,
    ctaTextSave,
    ctaTextShare,
    ctaTextSync,
    ctaTextGuess,
  } = assets.report.p29;

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
      text: '保存[源文件]',
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
      text: '分享[源文件]',
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
          const link =  process.env.NEXT_PUBLIC_BASE_SHARE_URL +  '/2025/'
          const shareHeadImg =
            process.env.NEXT_PUBLIC_CDN_BASE_URL +
            'assets/share-head-img-1221.png';
          const setShareInfoAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
            'share/setShareInfo'
          );

          await setShareInfoAction.dispatch({
            zhihuMessage: {
              content: '知乎｜2025 个人年度报告 \n 这一年，我真的____？\n 2025 我的「真实源文件」加载中 >> 快来查看吧 \n' + link,
              link,
            },
            wechatTimeline: {
              title: '知乎｜2025 个人年度报告',
              link: link,
              imgUrl: shareHeadImg,
            },
            wechatMessage: {
              title: '知乎｜2025 个人年度报告',
              desc: '回顾这一年，我真的____？点击加载真实 >>',
              link: link,
              imgUrl: shareHeadImg,
            },
            QQ: {
              url: link,
              title: '知乎｜2025 个人年度报告',
              content: '回顾这一年，我真的____？点击加载真实 >>',
              imageURL: shareHeadImg,
            },
            weibo: {
              url: link,
              title: '知乎｜2025 个人年度报告',
              content: '回顾这一年，我真的____？点击加载真实 >>',
              imageURL: shareHeadImg,
            },
            Qzone: {
              url: link,
              title: '知乎｜2025 个人年度报告',
              content: '回顾这一年，我真的____？点击加载真实 >>',
              imageURL: shareHeadImg,
            },
            PosterShare: {
              imageURL: summaryPoster.poster_url,
              pinContent: JSON.stringify(`<p>知乎｜2025 个人年度报告</p>`),
            },
          });

          const showActionSheetAction = (
            window.zhihuHybrid as ZhihuHybridNewAPI
          )('share/showShareActionSheet');
          // 使用 zhihuHybrid SDK 的分享功能
          // 根据知乎 Hybrid SDK 文档，分享功能通常使用 'base/share' 或 'social/share'
          // const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
          //   "base/share"
          // );
          await showActionSheetAction.dispatch({});
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
            fontSize: 16,
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
          padding: '0px 20px 25px',
          paddingTop: 0,
        }}
      >
        {/* Friend Interaction button */}
        <button
          onClick={handleFriendInteraction}
          className='flex items-center justify-center bg-[#000] rounded-full text-center'
          style={{ width: '330px', height: '43px', gap: 2 }}
        >
          <Image
            src={ctaTextGuess.url}
            alt={ctaTextGuess.alt}
            width={ctaTextGuess.width}
            height={ctaTextGuess.height}
            className='object-contain  pointer-events-none select-none z-0'
          />
          {assets.report.p29?.iconFriend && (
            <Image
              src={assets.report.p29.iconFriend.url}
              alt={assets.report.p29.iconFriend.alt}
              width={assets.report.p29.iconFriend.width / 2}
              height={assets.report.p29.iconFriend.height / 2}
              className='object-contain'
              style={{
                width: 24,
                height: 24,
              }}
            />
          )}
        </button>
        {/* Save and Share buttons */}
        <div
          className='flex gap-3'
          style={{ marginTop: '11px', marginBottom: '4px' }}
        >
          {/* Save button */}
          {
            isZhihuApp() || !isMobile ? (
              <button
                onClick={handleSave}
                className='flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center'
                style={{ width: '160px', height: '34px' }}
              >
                <Image
                  src={iconSave.url}
                  alt={iconSave.alt}
                  width={iconSave.width}
                  height={iconSave.height}
                  className='object-contain  pointer-events-none select-none z-0'
                />
                <Image
                  src={ctaTextSave.url}
                  alt={ctaTextSave.alt}
                  width={ctaTextSave.width}
                  height={ctaTextSave.height}
                  className='object-contain  pointer-events-none select-none z-0'
                />
              </button>
            ) : null
          }
  
          {/* Share button */}
          <button
            onClick={handleShare}
            className='flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center'
            style={{ width: '160px', height: '34px' }}
          >
            <Image
              src={iconShare.url}
              alt={iconShare.alt}
              width={iconShare.width}
              height={iconShare.height}
              className='object-contain  pointer-events-none select-none z-0'
            />
            <Image
              src={ctaTextShare.url}
              alt={ctaTextShare.alt}
              width={ctaTextShare.width}
              height={ctaTextShare.height}
              className='object-contain  pointer-events-none select-none z-0'
            />
          </button>
        </div>
        {/* Sync checkbox */}
        <label
          className='flex left-[200px] gap-2 cursor-pointer'
          style={{
            marginLeft: isZhihuApp() || !isMobile ? '160px' : 0,
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
          <Image
            src={ctaTextSync.url}
            alt={ctaTextSync.alt}
            width={ctaTextSync.width}
            height={ctaTextSync.height}
            className='object-contain  pointer-events-none select-none z-0'
          />
        </label>
      </div>
    </BaseScene>
  );
}
