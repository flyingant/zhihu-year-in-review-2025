"use client";
import Image from "next/image";
import Head from "next/head";
import KVSection from "../components/compound/KVSection";
import FolderSection from "../components/compound/FolderSection";
import SectionLayout from "../components/layout/SectionLayout";
import ZhihuLogo from "../components/ui/ZhihuLogo";
import WuZiDa2025 from "../components/ui/WuZiDa2025";
import LiuKanShanBianLiDian from "../components/ui/LiuKanShanBianLiDian";
import ZaiZhiHuLianJieZhenShi from "../components/ui/ZaiZhiHuLianJieZhenShi";
import QiangXianYuGao from "../components/ui/QiangXianYuGao";
import ZheXieZhenDeKeYi from "../components/ui/ZheXieZhenDeKeYi";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full max-w-[500px] mx-auto relative">
        {/* Logo */}
        <div className="pt-5 pb-2 flex justify-center">
          <ZhihuLogo />
        </div>

        {/* KV 部分 */}
        <SectionLayout topOffset={0} id="kv-section">
          <KVSection />
        </SectionLayout>

        {/* 文件夹交互部分 */}
        <SectionLayout topOffset={0} id="folder-section">
          <FolderSection />
        </SectionLayout>

        {/* New Image Components */}
        <SectionLayout topOffset={0} id="wuzida2025-section">
          <div className="flex justify-center py-8">
            <WuZiDa2025 />
          </div>
        </SectionLayout>

        <SectionLayout topOffset={0} id="liukanshan-bianlidian-section">
          <div className="flex justify-center py-8">
            <LiuKanShanBianLiDian />
          </div>
        </SectionLayout>

        <SectionLayout topOffset={0} id="zaizhihu-lianjie-zhenshi-section">
          <div className="flex justify-center py-8">
            <ZaiZhiHuLianJieZhenShi />
          </div>
        </SectionLayout>

        <SectionLayout topOffset={0} id="qiangxian-yugao-section">
          <div className="flex justify-center py-8">
            <QiangXianYuGao />
          </div>
        </SectionLayout>

        <SectionLayout topOffset={0} id="zhexie-zhende-keyi-section">
          <div className="flex justify-center py-8">
            <ZheXieZhenDeKeYi />
          </div>
        </SectionLayout>
      </main>
    </div>
  );
}
