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
import QiangXianYuGaoSection from "../components/compound/QiangXianYuGaoSection";
import QinZiDa2025Section from "../components/compound/QinZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../components/compound/ZheXieZhenDeKeYiSection";
import SidebarLiuKanshan from "../components/ui/SidebarLiuKanshan";
import AddressForm from "../components/ui/AddressForm";
import { useAssets } from '@/context/assets-context';

function HomeContent() {
  const searchParams = useSearchParams();
  const requireAddress = searchParams.get("requireAddress");
  const { assets, isLoading: isLoadingAssets } = useAssets();

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
        <main className="w-full mx-auto relative" style={{ maxWidth: '480px' }} >

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
