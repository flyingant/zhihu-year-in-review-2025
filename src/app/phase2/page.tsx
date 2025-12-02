"use client";
import Image from "next/image";
import Head from "next/head";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthWrapper from "../../components/layout/AuthWrapper";
import KVSection from "../../components/compound/KVSection";
import FolderSection from "../../components/compound/FolderSection";
import SectionLayout from "../../components/layout/SectionLayout";
import MiniComputerSection from "../../components/compound/MiniComputerSection";
import ZhihuLogo from "../../components/ui/ZhihuLogo";
import ZhihuSearch from "../../components/ui/zhihuSearch";
import HomeBottomBg from "../../components/ui/homeBottomBg";
import TaskSection from "../../components/compound/TaskSection";
import QiangXianYuGaoSection from "../../components/compound/QiangXianYuGaoSection";
import QinZiDa2025Section from "../../components/compound/QinZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../../components/compound/ZheXieZhenDeKeYiSection";
import SidebarLiuKanshan from "../../components/ui/SidebarLiuKanshan";
import AddressForm from "../../components/ui/AddressForm";
import { useAssets } from '@/context/assets-context';
import YearlyVideoSection from "@/components/compound/YearlyVideoSection";
import YearlyReportSection from "@/components/compound/YearlyReportSection";
import { useEffect } from 'react';
import { useZA } from '@/hooks/useZA';

function Phase2Content() {
  const { trackPageShow, trackPageDisappear, isReady } = useZA();
  const searchParams = useSearchParams();
  const requireAddress = searchParams.get("addressrequired");
  const { assets, isLoading: isLoadingAssets, error: assetsError, fetchAssets } = useAssets();

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  useEffect(() => {
    // 埋点2
    if (isReady) {
      trackPageShow();
    }
    return () => {
      // 埋点3
      trackPageDisappear();
    };
  }, [isReady]);

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
            <KVSection variant="phase2" />
          </SectionLayout>

          <SectionLayout topOffset={-45} id="yearly-video-section">
            <YearlyVideoSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="yearly-report-section">
            <YearlyReportSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="game-section">
            <MiniComputerSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="zaizhihu-lianjie-zhenshi-section">
            <ZaiZhiHuLianJieZhenShiSection />
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

export default function Phase2() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <Phase2Content />
    </Suspense>
  );
}

