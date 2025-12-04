"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAssets, componentExpiration } from '@/context/assets-context';
import request from '@/lib/request';
import { useToast } from '@/context/toast-context';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useZA } from '@/hooks/useZA';
import { completeTask } from '@/api/campaign';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';

interface TaskStatusResponse {
  task_status: number; // 0: 今日已领完, 1: 未领取还有剩余, 2: 已领取未填地址, 3: 已领取并已填地址
}

const SidebarLiuKanshan = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const isZhihu = useZhihuApp();
  const { assets } = useAssets();
  const { trackEvent } = useZA();
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();

  // Inject component-specific styles
  useEffect(() => {
    const styleId = 'sidebar-liukanshan-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes overlayShow {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .overlay-show {
          animation: overlayShow 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleAndBlink {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          25% {
            transform: scale(1.15);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          75% {
            transform: scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .liukanshan-animate {
          animation: scaleAndBlink 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDialogOpen]);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDialogOpen) {
        setIsDialogOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDialogOpen]);

  // Check expiration date
  useEffect(() => {
    const checkExpiration = () => {
      const expirationTime = componentExpiration.sidebarLiuKanshan;
      const currentTime = Date.now();
      setIsExpired(currentTime >= expirationTime);
    };

    // Check immediately
    checkExpiration();

    // Check every minute to handle expiration in real-time
    const interval = setInterval(checkExpiration, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Check if SidebarLiuKanshan overlaps with SidebarCampaignRules
  useEffect(() => {
    const checkOverlap = () => {
      const sidebarElement = sidebarRef.current;
      const campaignRulesElement = document.getElementById('sidebar-campaign-rules');

      if (!sidebarElement || !campaignRulesElement) {
        setIsOverlapping(false);
        return;
      }

      const sidebarRect = sidebarElement.getBoundingClientRect();
      const campaignRulesRect = campaignRulesElement.getBoundingClientRect();

      // Check if the two elements overlap
      const overlaps = !(
        sidebarRect.right < campaignRulesRect.left ||
        sidebarRect.left > campaignRulesRect.right ||
        sidebarRect.bottom < campaignRulesRect.top ||
        sidebarRect.top > campaignRulesRect.bottom
      );

      setIsOverlapping(overlaps);
    };

    // Check immediately
    checkOverlap();

    // Check on scroll and resize
    window.addEventListener('scroll', checkOverlap, { passive: true });
    window.addEventListener('resize', checkOverlap, { passive: true });

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(checkOverlap);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      window.removeEventListener('scroll', checkOverlap);
      window.removeEventListener('resize', checkOverlap);
      observer.disconnect();
    };
  }, []);

  // Listen for animation trigger event
  useEffect(() => {
    const handleAnimate = () => {
      setIsAnimating(true);
      // Reset animation state after animation completes (0.6s)
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    };

    window.addEventListener('liukanshan-animate', handleAnimate);
    return () => {
      window.removeEventListener('liukanshan-animate', handleAnimate);
    };
  }, []);

  // Check task status and update dialog state accordingly
  const checkTaskStatusAndUpdate = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await request<TaskStatusResponse>({
        url: '/campaigns/v2/2025/lks_gift_task_status',
        method: 'get',
      });

      const taskStatus = response.task_status;

      // Handle different task_status values
      if (taskStatus === 0) {
        // 今日已领完 - Show sold out dialog
        setIsSoldOut(true);
        setIsDialogOpen(true);
      } else if (taskStatus === 1) {
        // 未领取还有剩余 - Show current dialog
        setIsSoldOut(false);
        setIsDialogOpen(true);
      } else if (taskStatus === 2 || taskStatus === 3) {
        // 已领取未填地址 or 已领取并已填地址 - Show toast message and close dialog
        const toastMessage = taskStatus === 2
          ? '你已领取，请查收私信填写收货地址~'
          : '你已领取~';
        showToast(toastMessage);
        setIsDialogOpen(false);
      }
      return taskStatus;
    } catch (error) {
      console.error('Error fetching task status:', error);
      // On error, show the default dialog
      setIsSoldOut(false);
      if (showLoading) {
        setIsDialogOpen(false);
        showToast('出错了，请稍后重试');
      }
      return null;
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleSidebarClick = async () => {
    trackEvent('', {
      moduleId: 'liukanshan_gift_2025',
      type: 'Button',
      page: { page_id: '60850', page_level: 1 }
    })

    // Call completeTask API (fire-and-forget, non-blocking)
    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.CLICK_LKS_GIFT).catch((error) => {
        console.error('Error completing task CLICK_LKS_GIFT:', error);
        // Silently fail - this is just tracking, don't block user flow
      });
    }

    await checkTaskStatusAndUpdate(true);
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };

  const handlePublishHover = async () => {
    // Check task status on hover to update dialog if status changed
    if (isCheckingStatus) return;
    setIsCheckingStatus(true);
    try {
      // Call completeTask API (fire-and-forget, non-blocking)
    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.CLICK_LKS_GIFT_PUBLISH).catch((error) => {
        console.error('Error completing task CLICK_LKS_GIFT_PUBLISH:', error);
        // Silently fail - this is just tracking, don't block user flow
      });
    }
      await checkTaskStatusAndUpdate(false);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handlePublishClick = async () => {
    // Check task status first before proceeding
    if (isCheckingStatus) return;
    setIsCheckingStatus(true);
    //埋点27
    trackEvent('', {
      moduleId: 'liukanshan_gift_publish_2025',
      type: 'Button',
      page: { page_id: '60850', page_level: 1 }
    });

    // Call completeTask API (fire-and-forget, non-blocking)
    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.CLICK_LKS_GIFT_PUBLISH).catch((error) => {
        console.error('Error completing task CLICK_LKS_GIFT_PUBLISH:', error);
        // Silently fail - this is just tracking, don't block user flow
      });
    }

    try {
      const taskStatus = await checkTaskStatusAndUpdate(false);

      // If status changed to sold out (0) or already claimed (2/3), don't redirect
      if (taskStatus === 0 || taskStatus === 2 || taskStatus === 3) {
        setIsCheckingStatus(false);
        return;
      }

      // Redirect to publish page
      const redirectUrl = assets?.urls?.sidebarLiuKanshanPublish;
      if (redirectUrl) {
        // Use zhihuHybrid if in zhihu app, otherwise use window.location.href
        if (isZhihu && isHybridAvailable) {
          try {
            await openURL(redirectUrl);
          } catch (error) {
            console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
            window.location.href = redirectUrl;
          }
        } else {
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error('Error in handlePublishClick:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleTmrClick = () => {
    // Close dialog when sold out button is clicked
    setIsDialogOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close dialog if clicking on the overlay (not on the content)
    if (e.target === e.currentTarget) {
      setIsDialogOpen(false);
    }
  };

  // Don't render if expired or assets not loaded
  if (isExpired || !assets) {
    return null;
  }

  // Asset calculations (after hooks and early return checks)
  const imageAsset = assets.newImages.sidebarLiuKanshan;
  const dialogAsset = assets.newImages.sidebarLiuKanshanDialog;
  const dialogSoldOutAsset = assets.newImages.sidebarLiuKanshanDialogSoldOut;
  const cancelAsset = assets.newImages.sidebarLiuKanshanCancel;
  const publishAsset = assets.newImages.sidebarLiuKanshanPublish;
  const publishPcAsset = assets.newImages.sidebarLiuKanshanPublishPc;
  const qrcodeAsset = assets.newImages.sidebarLiuKanshanQrcode;
  const qrcodeTipsAsset = assets.newImages.sidebarLiuKanshanQrcodeTips;
  const tmrAsset = assets.newImages.sidebarLiuKanshanTmr;

  const displayWidth = imageAsset.width / 2;
  const displayHeight = imageAsset.height / 2;

  // Calculate maximum button width to ensure consistent UI
  const cancelButtonWidth = cancelAsset.width / 6;
  const publishButtonWidth = isZhihu ? publishAsset.width : publishPcAsset.width / 6;
  const maxButtonWidth = Math.max(cancelButtonWidth, publishButtonWidth);

  // Select dialog image based on sold out status
  const currentDialogAsset = isSoldOut ? dialogSoldOutAsset : dialogAsset;

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-[50%] -translate-y-1/2 z-[9999] pointer-events-auto cursor-pointer ${isAnimating ? 'liukanshan-animate' : ''}`}
        onClick={handleSidebarClick}
        style={{
          opacity: isLoading ? 0.6 : (isOverlapping ? 0 : 1),
          pointerEvents: isLoading || isOverlapping ? 'none' : 'auto',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Image
          src={imageAsset.url}
          alt={imageAsset.alt}
          width={imageAsset.width}
          height={imageAsset.height}
          style={{ width: `${displayWidth}px`, height: `${displayHeight}px`, pointerEvents: 'none' }}
          className="object-contain"
        />
      </div>

      {/* Fullscreen Dialog */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 overlay-show"
          onClick={handleOverlayClick}
        >
          <div className="relative w-full flex flex-col items-center px-4 animate-contentShow" style={{ maxWidth: '480px' }}>
            {/* Dialog Content Image */}
            <div className="relative w-full mb-6">
              <Image
                src={currentDialogAsset.url}
                alt={currentDialogAsset.alt}
                width={currentDialogAsset.width}
                height={currentDialogAsset.height}
                className="object-contain w-full h-auto"
              />
            </div>

            {/* Button Container */}
            <div className="flex gap-4 justify-center w-full max-w-[480px]">
              {isSoldOut ? (
                /* Sold Out: Show only TMR button */
                <div
                  onClick={handleTmrClick}
                  className="relative cursor-pointer active:opacity-80 transition-opacity"
                  style={{ width: `${tmrAsset.width}px`, height: `${tmrAsset.height}px` }}
                >
                  <Image
                    src={tmrAsset.url}
                    alt={tmrAsset.alt}
                    width={tmrAsset.width}
                    height={tmrAsset.height}
                    className="object-contain w-full h-full"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              ) : (
                /* Not Sold Out: Show Cancel and Publish buttons */
                <>
                  {/* Cancel Button */}
                  <div
                    onClick={handleCancelClick}
                    className="relative cursor-pointer active:opacity-80 transition-opacity"
                    style={{ width: `${maxButtonWidth}px`, height: `${cancelAsset.height / 6}px` }}
                  >
                    <Image
                      src={cancelAsset.url}
                      alt={cancelAsset.alt}
                      width={cancelAsset.width}
                      height={cancelAsset.height}
                      className="object-contain w-full h-full"
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>

                  {/* Publish Button */}
                  {isZhihu ? (
                    // Zhihu App: Use original publish button
                    <div
                      onClick={handlePublishClick}
                      onMouseEnter={handlePublishHover}
                      className="relative cursor-pointer active:opacity-80 transition-opacity"
                      style={{ width: `${maxButtonWidth}px`, height: `${publishAsset.height / 2}px` }}
                    >
                      <Image
                        src={publishAsset.url}
                        alt={publishAsset.alt}
                        width={publishAsset.width}
                        height={publishAsset.height}
                        className="object-contain w-full h-full"
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  ) : (
                    // Normal Browser: Use PC publish button with QR code positioned absolutely
                    <div
                      onClick={handlePublishClick}
                      onMouseEnter={handlePublishHover}
                      className="relative cursor-pointer active:opacity-80 transition-opacity"
                      style={{ width: `${maxButtonWidth}px`, height: `${publishPcAsset.height / 6}px` }}
                    >
                      <Image
                        src={publishPcAsset.url}
                        alt={publishPcAsset.alt}
                        width={publishPcAsset.width}
                        height={publishPcAsset.height}
                        className="object-contain w-full h-full"
                        style={{ pointerEvents: 'none' }}
                      />
                      {/* QR Code and Tips */}
                      <div className="absolute flex flex-col items-center gap-2" style={{ top: '66px', right: '26px' }}>
                        <div
                          className="relative shrink-0"
                          style={{ width: `${qrcodeAsset.width / 6}px`, height: `${qrcodeAsset.height / 6}px` }}
                        >
                          <Image
                            src={qrcodeAsset.url}
                            alt={qrcodeAsset.alt}
                            width={qrcodeAsset.width}
                            height={qrcodeAsset.height}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div
                          className="relative shrink-0"
                          style={{ width: `${qrcodeTipsAsset.width / 6}px`, height: `${qrcodeTipsAsset.height / 6}px` }}
                        >
                          <Image
                            src={qrcodeTipsAsset.url}
                            alt={qrcodeTipsAsset.alt}
                            width={qrcodeTipsAsset.width}
                            height={qrcodeTipsAsset.height}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarLiuKanshan;

