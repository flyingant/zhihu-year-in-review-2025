"use client";
import Image from "next/image";
import Head from "next/head";
import AuthWrapper from "../components/layout/AuthWrapper";
import KVSection from "../components/compound/KVSection";
import FolderSection from "../components/compound/FolderSection";
import SectionLayout from "../components/layout/SectionLayout";
import GameSection from "../components/compound/GameSection";
import ZhihuLogo from "../components/ui/ZhihuLogo";
import WuZiDa2025 from "../components/ui/WuZiDa2025";
import LiuKanShanBianLiDian from "../components/ui/LiuKanShanBianLiDian";
import ZaiZhiHuLianJieZhenShi from "../components/ui/ZaiZhiHuLianJieZhenShi";
import QiangXianYuGao from "../components/ui/QiangXianYuGao";
import ZheXieZhenDeKeYi from "../components/ui/ZheXieZhenDeKeYi";
import TaskSection from "../components/compound/TaskSection";
import QiangXianYuGaoSection from "../components/compound/QiangXianYuGaoSection";
import WuZiDa2025Section from "../components/compound/WuZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../components/compound/ZheXieZhenDeKeYiSection";
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

          {/* KV 部分 */}
          <SectionLayout topOffset={0} id="kv-section">
            <KVSection />
          </SectionLayout>

          {/* 文件夹交互部分 */}
          <SectionLayout topOffset={0} id="folder-section">
            <FolderSection />
          </SectionLayout>

          <SectionLayout topOffset={0} id="game-section">
            <GameSection />
          </SectionLayout>

          {/* New Image C omponents */}
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

          <SectionLayout topOffset={0} id="liukanshan-bianlidian-section">
            <div className="flex justify-center">
              <LiuKanShanBianLiDian />
            </div>
          </SectionLayout>

          <SectionLayout topOffset={0} id="task-section">
            <TaskSection />
          </SectionLayout>
        </main>
      </AuthWrapper>
    </div>
  );
}
