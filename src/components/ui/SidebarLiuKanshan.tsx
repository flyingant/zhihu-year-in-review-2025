"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';
import request from '@/lib/request';
import { useToast } from '@/context/toast-context';

interface TaskStatusResponse {
  task_status: number; // 0: 今日已领完, 1: 未领取还有剩余, 2: 已领取未填地址, 3: 已领取并已填地址
}

const SidebarLiuKanshan = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const imageAsset = asset(assets.newImages.sidebarLiuKanshan) as { url: string; alt: string; width: number; height: number };
  const dialogAsset = asset(assets.newImages.sidebarLiuKanshanDialog) as { url: string; alt: string; width: number; height: number };
  const dialogSoldOutAsset = asset(assets.newImages.sidebarLiuKanshanDialogSoldOut) as { url: string; alt: string; width: number; height: number };
  const cancelAsset = asset(assets.newImages.sidebarLiuKanshanCancel) as { url: string; alt: string; width: number; height: number };
  const publishAsset = asset(assets.newImages.sidebarLiuKanshanPublish) as { url: string; alt: string; width: number; height: number };
  const tmrAsset = asset(assets.newImages.sidebarLiuKanshanTmr) as { url: string; alt: string; width: number; height: number };
  
  const displayWidth = imageAsset.width / 2;
  const displayHeight = imageAsset.height / 2;
  
  // Select dialog image based on sold out status
  const currentDialogAsset = isSoldOut ? dialogSoldOutAsset : dialogAsset;

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

  const handleSidebarClick = async () => {
    setIsLoading(true);
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
        // 已领取未填地址 or 已领取并已填地址 - Show toast message
        // TODO: Replace with actual toast message text when provided
        const toastMessage = taskStatus === 2 
          ? '你已领取，请查收私信填写收货地址~' 
          : '你已领取~';
        showToast(toastMessage);
      }
    } catch (error) {
      console.error('Error fetching task status:', error);
      // On error, show the default dialog
      setIsSoldOut(false);
      setIsDialogOpen(false);
      showToast('出错了，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsDialogOpen(false);
  };

  const handlePublishClick = () => {
    // Redirect to external link - update this URL as needed
    window.location.href = 'https://oia.zhihu.com/community/short_pin_editor?tab=pin&content=%7B%22html%22%3A%22%3Cp%3E2026%E6%9C%80%E6%83%B3%E5%81%9A%E7%9A%84%E4%B8%80%E4%BB%B6%E4%BA%8B%20%3Ca%20class%3D%5C%22hash_tag%5C%22%20data-topic-id%3D%5C%22unknown%5C%22%3E%232025%E5%88%B0%E5%BA%95%E4%BB%80%E4%B9%88%E6%98%AF%E7%9C%9F%E7%9A%84%23%3C%2Fa%3E%20%3Ca%20class%3D%5C%22hash_tag%5C%22%20data-topic-id%3D%5C%22unknown%5C%22%3E%23%E5%88%98%E7%9C%8B%E5%B1%B1%E9%80%81%E7%A4%BC%E7%89%A9%E6%98%AF%E7%9C%9F%E7%9A%84%23%3C%2Fa%3E%20%20%3Ca%20href%3D%5C%22https%3A%2F%2Fwww.zhihu.com%2Fcampagin%2Fmain_hall_2025new%5C%22%20data-insert-way%3D%5C%22force%5C%22%20data-draft-node%3D%5C%22inline%5C%22%20data-draft-type%3D%5C%22text-link%5C%22%3E%E4%B8%BB%E4%BC%9A%E5%9C%BA%E9%93%BE%E6%8E%A5%3C%2Fa%3E%20%3C%2Fp%3E%22%2C%22meta%22%3A%7B%22topic%22%3A%7B%22all%22%3A0%2C%22data%22%3A%7B%7D%7D%2C%22adActivityLink%22%3A%7B%22all%22%3A0%2C%22data%22%3A%7B%7D%7D%7D%7D&jump_url=https://www.zhihu.com/campagin/zhihu2025';
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

  return (
    <>
      <div 
        className="fixed right-0 top-[50%] -translate-y-1/2 z-[9999] pointer-events-auto cursor-pointer"
        onClick={handleSidebarClick}
        style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        <Image
          src={imageAsset.url}
          alt={imageAsset.alt}
          width={imageAsset.width}
          height={imageAsset.height}
          style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
          className="object-contain"
        />
      </div>

      {/* Fullscreen Dialog */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/80 overlay-show"
          onClick={handleOverlayClick}
        >
          <div className="relative w-full max-w-[750px] flex flex-col items-center px-4 animate-contentShow">
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
            <div className="flex gap-4 justify-center w-full max-w-[640px]">
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
                  />
                </div>
              ) : (
                /* Not Sold Out: Show Cancel and Publish buttons */
                <>
                  {/* Cancel Button */}
                  <div
                    onClick={handleCancelClick}
                    className="relative cursor-pointer active:opacity-80 transition-opacity"
                    style={{ width: `${cancelAsset.width}px`, height: `${cancelAsset.height}px` }}
                  >
                    <Image
                      src={cancelAsset.url}
                      alt={cancelAsset.alt}
                      width={cancelAsset.width}
                      height={cancelAsset.height}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Publish Button */}
                  <div
                    onClick={handlePublishClick}
                    className="relative cursor-pointer active:opacity-80 transition-opacity"
                    style={{ width: `${publishAsset.width}px`, height: `${publishAsset.height}px` }}
                  >
                    <Image
                      src={publishAsset.url}
                      alt={publishAsset.alt}
                      width={publishAsset.width}
                      height={publishAsset.height}
                      className="object-contain w-full h-full"
                    />
                  </div>
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

