"use client";
import Image from "next/image";
import Head from "next/head";
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
import WuZiDa2025Section from "../components/compound/WuZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../components/compound/ZheXieZhenDeKeYiSection";
import SidebarLiuKanshan from "../components/ui/SidebarLiuKanshan";
import { assets, asset } from '@/lib/assets';


export default function Home() {
  const bgAsset = asset(assets.home.bg) as { url: string; alt: string, height: number, width: number };
  return (
    <div className="min-h-screen bg-white">
      <AuthWrapper>
        <main className="w-full max-w-[500px] mx-auto relative">

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
            <WuZiDa2025Section />
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
