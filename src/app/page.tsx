"use client";
import Image from "next/image";
import Head from "next/head";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthWrapper from "../components/layout/AuthWrapper";
import KVSection from "../components/compound/KVSection";
import FolderSection from "../components/compound/FolderSection";
import SectionLayout from "../components/layout/SectionLayout";
import MiniComputerSection from "../components/compound/MiniComputerSection";
import ZhihuLogo from "../components/ui/ZhihuLogo";
import ZhihuSearch from "../components/ui/zhihuSearch";
import HomeBottomBg from "../components/ui/homeBottomBg";
import TaskSection from "../components/compound/TaskSection";
import RewardSection from "../components/compound/RewardSection";
import QiangXianYuGaoSection from "../components/compound/QiangXianYuGaoSection";
import QinZiDa2025Section from "../components/compound/QinZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../components/compound/ZheXieZhenDeKeYiSection";
import SidebarLiuKanshan from "../components/ui/SidebarLiuKanshan";
import AddressForm from "../components/ui/AddressForm";
import { useAssets } from '@/context/assets-context';
import { useEffect } from 'react';
import { useZA } from '@/hooks/useZA';

function HomeContent() {
  const { trackPageShow, trackPageDisappear, isReady } = useZA();
  const searchParams = useSearchParams();
  const requireAddress = searchParams.get("addressrequired");
  const directTo = searchParams.get("directTo");
  const { assets, isLoading: isLoadingAssets, error: assetsError, fetchAssets } = useAssets();

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  useEffect(() => {
    // 埋点2
    if (isReady) {
      trackPageShow({ page: { page_id: '60850', page_level: 1 } });
    }
    return () => {
      // 埋点3
      trackPageDisappear({ page: { page_id: '60850', page_level: 1 } });
    };
  }, [isReady]);

  // Handle directTo search parameter for scrolling
  useEffect(() => {
    if (!directTo || isLoadingAssets || !assets) return;

    // Map directTo parameter to section ID (case-insensitive)
    const directToLower = directTo.toLowerCase();
    const sectionMap: Record<string, string> = {
      'pointreward': 'reward-section',
      'reward': 'reward-section',
      'pointtask': 'task-section',
      'task': 'task-section',
      'miniComputer': 'game-section',
    };

    const targetId = sectionMap[directToLower];
    if (!targetId) return;

    let retryCount = 0;
    const maxRetries = 20; // Try for up to 4 seconds (20 * 200ms)
    let timeoutId: NodeJS.Timeout | null = null;
    let rafId: number | null = null;

    const attemptScroll = () => {
      const targetElement = document.getElementById(targetId);

      if (targetElement && targetElement.isConnected) {
        // Element found and connected to DOM, scroll to it
        // Use requestAnimationFrame to ensure layout is complete
        rafId = requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              // Use scrollIntoView for reliable scrolling
              // block: 'start' aligns the element to the top of the viewport
              // behavior: 'smooth' provides smooth scrolling animation
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              });
            } catch (error) {
              console.warn('Scroll failed:', error);
              // Fallback: try manual scroll calculation
              try {
                const rect = targetElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 20; // 20px offset for better visibility
                window.scrollTo({
                  top: Math.max(0, targetPosition),
                  behavior: 'smooth'
                });
              } catch (fallbackError) {
                console.warn('Fallback scroll also failed:', fallbackError);
              }
            }
          }, 50);
        });
        return true; // Success
      }

      // Element not found or not connected yet, retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        retryCount++;
        timeoutId = setTimeout(attemptScroll, 200);
        return false; // Still trying
      }

      // Max retries reached, element not found
      console.warn(`Could not find element with id: ${targetId} after ${maxRetries} attempts`);
      return false;
    };

    // Start attempting to scroll after a small initial delay
    timeoutId = setTimeout(attemptScroll, 300);

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [directTo, isLoadingAssets, assets]);

  // Show error state if assets failed to load
  if (assetsError && !isLoadingAssets) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            资源加载失败
          </h1>

          <p className="text-gray-600 mb-4">
            {assetsError}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              重新加载页面
            </button>

            <button
              onClick={fetchAssets}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingAssets || !assets) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const bgAsset = assets.home.bg;

  // Show address form if requireAddress parameter is present
  if (requireAddress) {
    return (
      <div className="min-h-screen bg-white">
        <AuthWrapper>
          <AddressForm />
        </AuthWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthWrapper>
        <main className="w-full mx-auto relative" style={{ maxWidth: '640px' }} >

          {/* Logo */}
          <div className="pt-5 flex justify-center">
            <ZhihuLogo />
          </div>
          <div className="absolute inset-0 z-0 top-[38px]">
            <Image
              src={bgAsset.url}
              alt={bgAsset.alt}
              width={bgAsset.width}
              height={bgAsset.height}
              className="object-contain"
              priority
            />
          </div>
          {/* 刘看山对话框 */}
          <SidebarLiuKanshan />

          {/* KV 部分 */}
          <SectionLayout topOffset={0} id="kv-section">
            <KVSection />
          </SectionLayout>

          {/* 文件夹交互部分 */}
          <SectionLayout topOffset={0} id="folder-section">
            <FolderSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="game-section">
            <MiniComputerSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="qiangxian-yugao-section">
            <QiangXianYuGaoSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="zhexie-zhende-keyi-section">
            <ZheXieZhenDeKeYiSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="wuzida2025-section">
            <QinZiDa2025Section />
          </SectionLayout>

          <SectionLayout topOffset={0} id="zaizhihu-lianjie-zhenshi-section">
            <ZaiZhiHuLianJieZhenShiSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="reward-section">
            <RewardSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="task-section">
            <TaskSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="zhihu-search-section">
            <ZhihuSearch />
          </SectionLayout>

          <SectionLayout topOffset={-12} id="home-bottom-bg-section">
            <HomeBottomBg />
          </SectionLayout>
        </main>
      </AuthWrapper>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
