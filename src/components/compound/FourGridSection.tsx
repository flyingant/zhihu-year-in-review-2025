"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useMobile } from '@/hooks/useMobile';
import { useUserData } from '@/context/user-data-context';
import { useToast } from '@/context/toast-context';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { isZhihuApp } from '@/lib/zhihu-detection';
import { MomentPosition, MomentLightItem } from '@/api/campaign';

// Position to display name mapping
const POSITION_NAME_MAP: Record<MomentPosition, string> = {
  'annual_video': '年度视频',
  'annual_report': '个人报告',
  'annual_question': '年度十问',
  'really_can': '这些真的可以',
};

// Display order for the grid
const POSITION_ORDER: MomentPosition[] = [
  'annual_video',
  'annual_report',
  'annual_question',
  'really_can',
];

interface DialogImageData {
  url: string;
  name: string;
  alt: string;
  downloadUrl: string;
}

const FourGridSection = () => {
  const { assets } = useAssets();
  const { userData } = useUserData();
  const { showToast } = useToast();
  const { downloadImage: downloadImageViaHybrid } = useZhihuHybrid();
  const isMobile = useMobile();
  const [dialogImage, setDialogImage] = useState<DialogImageData | null>(null);

  if (!assets) return null;

  const fourGridAssets = assets.fourGrid;
  const bgImage = fourGridAssets.bg;
  const previewAssets = fourGridAssets.preview;
  const downloadAssets = fourGridAssets.download;

  // Create a map from position to MomentLightItem for quick lookup
  const lightStatusMap = new Map<MomentPosition, MomentLightItem>();
  if (userData?.momentLightList) {
    userData.momentLightList.forEach((item) => {
      lightStatusMap.set(item.position, item);
    });
  }

  const handleImageClick = (item: MomentLightItem, imageUrl: string, imageAlt: string) => {
    
    const downloadAsset = downloadAssets[item.position];
    if (!downloadAsset) {
      switch (item.position) {
        case 'annual_video': {
          // 滚动到 "2025年度视频" 部分
          const targetSection = document.getElementById('2025-yearly-video-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: zhexie-zhende-keyi-section');
            showToast('请稍后再试', 'info');
          }
          break;
        }
        case 'annual_report': {
          // 滚动到 "2025年度报告" 部分
          const targetSection = document.getElementById('2025-yearly-report-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: 2025年度报告');
            showToast('请稍后再试', 'info');
          }
          break;
        }
        case 'annual_question': {
          // 滚动到 "2025年度十问" 部分
          const targetSection = document.getElementById('2025-yearly-ten-questions-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: 2025年度十问');
            showToast('请稍后再试', 'info');
          }
          break;
        }
        case 'really_can': {
          // 滚动到 "这些真的可以" 部分
          const targetSection = document.getElementById('zhexie-zhende-keyi-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('未找到目标区域: zhexie-zhende-keyi-section');
            showToast('请稍后再试', 'info');
          }
          break;
        }
      }
      return;
    }

    setDialogImage({
      url: imageUrl,
      name: POSITION_NAME_MAP[item.position],
      alt: imageAlt,
      downloadUrl: downloadAsset.url,
    });
  };

  const handleCloseDialog = () => {
    setDialogImage(null);
  };

  const downloadImageStandard = async (imageUrl: string) => {
    try {
      const tryCanvasMethod = (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
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
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = imageUrl;
        });
      };

      const tryFetchMethod = async (): Promise<Blob> => {
        const response = await fetch(imageUrl, {
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.blob();
      };

      const tryDirectDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `fourgrid-${Date.now()}.png`;
        link.target = '_blank';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      let blob: Blob;

      try {
        blob = await tryCanvasMethod();
      } catch (canvasError) {
        console.warn('Canvas method failed, trying fetch:', canvasError);
        try {
          blob = await tryFetchMethod();
        } catch (fetchError) {
          console.warn('Fetch method failed, using direct download:', fetchError);
          tryDirectDownload();
          return;
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `fourgrid-${Date.now()}.png`;
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

  const handleSaveImage = async () => {
    // Redirect to Zhihu App if not in app and on mobile
    if (!isZhihuApp() && isMobile && assets?.urls?.inAppRedirectionURL) {
      window.location.href = assets.urls.inAppRedirectionURL;
      return;
    }
    if (!dialogImage) {
      showToast('没有可保存的图片', 'error');
      return;
    }

    // Use the download URL from assets context
    const downloadUrl = dialogImage.downloadUrl;

    if (isZhihuApp()) {
      try {
        await downloadImageViaHybrid(downloadUrl);
        showToast('图片保存成功', 'success');
      } catch (error) {
        console.error('Failed to save image via zhihuHybrid:', error);
        await downloadImageStandard(downloadUrl);
      }
    } else {
      await downloadImageStandard(downloadUrl);
    }
  };

  return (
    <>
      <div className="relative w-full flex items-center pt-5">
        <div className="relative w-full">
          <div className="z-0 w-full">
            <Image
              src={bgImage.url}
              alt={bgImage.alt}
              width={bgImage.width}
              height={bgImage.height}
              className="w-full h-auto object-fill"
              priority
            />
          </div>

          <div
            className={`absolute z-10 flex top-[42%] left-[11.5%] justify-between w-[calc(100%-23%)] ${isMobile ? 'gap-[3px]' : 'gap-[9px]'}`}>
            {POSITION_ORDER.map((position) => {
              const lightStatus = lightStatusMap.get(position);
              const previewAsset = previewAssets[position];
              
              if (!lightStatus || !previewAsset) {
                // Use same aspect ratio for placeholder
                const placeholderAspectRatio = 441 / 639;
                const placeholderWidth = 70;
                const placeholderHeight = placeholderWidth / placeholderAspectRatio;
                return (
                  <div key={position} className="flex">
                    <div 
                      className="relative" 
                      style={{
                        width: `${placeholderWidth}px`,
                        height: `${placeholderHeight}px`,
                      }}
                    />
                  </div>
                );
              }

              const isCompleted = lightStatus.light_status === 1;
              const name = POSITION_NAME_MAP[position];
              const imageAlt = isCompleted ? `${name}-亮` : `${name}-暗`;
              const isClickable = isCompleted;

              // Calculate container dimensions based on image aspect ratio
              // Preview images are 441x639, so aspect ratio is 441:639
              const imageAspectRatio = previewAsset.width / previewAsset.height; // 441/639 ≈ 0.69
              const containerWidth = 70;
              const containerHeight = containerWidth / imageAspectRatio; // ≈ 101.4px

              return (
                <div key={position} className="flex">
                  <div 
                    className={`relative flex items-center justify-center ${
                      isClickable 
                        ? 'cursor-pointer' 
                        : 'cursor-not-allowed'
                    }`}
                    style={{
                      width: `${containerWidth}px`,
                      height: `${containerHeight}px`,
                    }}
                    onClick={isClickable ? () => handleImageClick(lightStatus, previewAsset.url, imageAlt) : undefined}
                  >
                    <div className="relative inline-flex items-center justify-center">
                      <Image
                        src={previewAsset.url}
                        alt={imageAlt}
                        width={previewAsset.width}
                        height={previewAsset.height}
                        className="object-contain"
                      />
                      {!isCompleted && (
                        <>
                          <Image
                            src={previewAsset.url}
                            alt={imageAlt}
                            width={previewAsset.width}
                            height={previewAsset.height}
                            className="object-contain mosaic-effect absolute"
                            style={{
                              width: '80%',
                              height: '68%',
                              top: '7%',
                              left: '10%',
                            }}
                          />
                          <div 
                            className="absolute pointer-events-none mosaic-overlay"
                            style={{
                              width: '80%',
                              height: '68%',
                              top: '7%',
                              left: '10%',
                              backgroundImage: `
                                repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px),
                                repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)
                              `,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      {dialogImage && (
        <div className="fixed z-[9999] inset-0 h-screen flex flex-col items-center justify-center bg-black/80 animate-overlayShow overflow-y-auto">
          <div className="relative flex flex-col items-center gap-4 animate-contentShow max-w-[90vw] w-full px-4 py-8">
            {/* Image */}
            <div className="relative w-full max-w-[375px] flex-shrink-0 max-h-[60vh] overflow-hidden">
              <Image
                src={dialogImage.downloadUrl}
                alt={dialogImage.alt}
                width={750}
                height={1334}
                className="w-full h-auto object-contain max-h-[60vh]"
                unoptimized
              />
            </div>

            {/* Save Image Button */}
            <div className="flex gap-4 w-full max-w-[300px] px-2 justify-center">
              <div
                onClick={handleSaveImage}
                className="flex justify-center items-center cursor-pointer active:opacity-50"
              >
                {fourGridAssets.save && (
                  <Image
                    src={fourGridAssets.save.url}
                    alt={fourGridAssets.save.alt}
                    width={fourGridAssets.save.width / 6}
                    height={fourGridAssets.save.height / 6}
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>
            </div>

            {/* Close Icon Button */}
            <button
              onClick={handleCloseDialog}
              className="w-10 h-10 flex items-center justify-center text-white hover:opacity-70 transition-opacity mt-2"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FourGridSection;