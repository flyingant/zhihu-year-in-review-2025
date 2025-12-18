"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import { generateSummaryPoster } from "@/api/report";
import { useToast } from "@/context/toast-context";
import { useUserReportData } from "@/context/user-report-data-context";
import { summaryFlags } from "@/utils/common";
import GlitchLayer from "../effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P28Scene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { showToast } = useToast();
  const { setSummaryPoster, summaryPoster } = useUserReportData();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const isFriendView = searchParams.get("friendView");
  const isShareView = searchParams.get("shareView");
  const [shareOptionKeys, setShareOptionKeys] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState(false);

  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const bgAsset = p28Assets.bg;
  const titleSelfAsset = p28Assets.titleSelf;
  const titleOtherAsset = p28Assets.titleOther;
  const flagsAssets = p28Assets.flags || {};
  const bannersAssets = p28Assets.banners || {};
  const flagEmptyAsset = p28Assets.flagEmpty;
  const mix3Asset = assets.report.bg.mix0_3;

  const handleGeneratePoster = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!inputValue.trim() && !selectedFlag) {
      showToast("请选择或输入文字", "error");
      return;
    }

    if (inputValue.trim().length > 2) {
      showToast("最多只能输入2个字符", "error");
      return;
    }

    setIsLoading(true);
    try {
      const text = selectedFlag
        ? summaryFlags.find((flag) => flag.key === selectedFlag)?.text || ""
        : `${inputValue.trim()}`;
      const testMemberId = searchParams?.get("test_member_id") || undefined;
      const response = await generateSummaryPoster({
        text,
        ...(testMemberId && { test_member_id: testMemberId }),
      });

      // Save poster data to context
      setSummaryPoster({
        poster_id: response.poster_id,
        poster_url: response.poster_url,
        text: text,
        key: selectedFlag || "empty",
        bg: selectedFlag
          ? summaryFlags.find((flag) => flag.key === selectedFlag)?.bg || ""
          : "#B6DFFE",
      });

      showToast("海报生成成功！", "success");

      // Call onNext after successful generation
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error("Failed to generate poster:", error);
      showToast("生成失败，请重试", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (key: string) => {
    if (isShareView) {
      if (shareOptionKeys.includes(key)) {
        setShareOptionKeys(shareOptionKeys.filter((k) => k !== key));
      } else {
        const newKyes = [...shareOptionKeys, key];
        setShareOptionKeys(newKyes.slice(-3));
      }
    } else {
      // Toggle selection: if same flag is clicked, deselect it
      setSelectedFlag(selectedFlag === key ? null : key);
    }
  };

  const handleShare = () => {};

  const handleSyncToggle = () => {
    setIsSynced(!isSynced);
    // TODO: Implement sync functionality
  };

  return (
    <BaseScene
      onNext={onNext}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      <GlitchLayer>
        <Image
          className="absolute"
          style={{ right: 8, bottom: 150 }}
          src={assets.report.bg.blue0_1.url}
          alt={assets.report.bg.blue0_1.alt}
          width={38}
          height={38}
        />

        <Image
          className="absolute left-0"
          style={{ top: 610 }}
          src={p28Assets.bg2.url}
          alt={p28Assets.bg2.alt}
          width={p28Assets.bg2.width}
          height={p28Assets.bg2.height}  
        />
        <Image
          className="absolute"
          style={{ left: 80, top: 550 }}
          src={p28Assets.bg4.url}
          alt={p28Assets.bg4.alt}
          width={p28Assets.bg4.width}
          height={p28Assets.bg4.height}
        />
        <Image
          className="absolute"
          style={{ right: 20, bottom: 20 }}
          src={p28Assets.bg6.url}
          alt={p28Assets.bg6.alt}
          width={p28Assets.bg6.width}
          height={p28Assets.bg6.height}
        />
        <Image
          className="absolute left-0"
          style={{ top: 53 }}
          src={p28Assets.bg1.url}
          alt={p28Assets.bg1.alt}
          width={p28Assets.bg1.width}
          height={p28Assets.bg1.height}  
        />
        
        <Image
          className="absolute right-0"
          style={{ top: 98 }}
          src={p28Assets.bg3.url}
          alt={p28Assets.bg3.alt}
          width={p28Assets.bg3.width}
          height={p28Assets.bg3.height}  
        />
      </GlitchLayer>
      {/* content */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="absolute z-[-2] w-auto h-full pointer-events-none select-none"
        />

        <Image
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 60 }}
          src={assets.kv.logo.url}
          alt={assets.kv.logo.alt}
          width={92}
          height={18}  
        />
        <Image
          src={
           titleSelfAsset.url
          }
          alt={
           titleSelfAsset.alt
          }
          width={
            titleSelfAsset.width
          }
          height={
            titleSelfAsset.height
          }
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 114 }}
        />
        {isShareView && summaryPoster?.key && (
          (() => {
            const banner = bannersAssets[summaryPoster.key as keyof typeof bannersAssets];
            if (!banner) return null;
            // Use active variant for share view
            const bannerAsset = banner.active;
            return (
              <div
                className="relative"
                style={{ top: 131, gap: 22, left: 20, right: 20 }}
              >
                <Image
                  src={bannerAsset.url}
                  width={bannerAsset.width}
                  height={bannerAsset.height}
                  alt={bannerAsset.alt}
                />
              </div>
            );
          })()
        )}
        <div
          className="relative flex flex-wrap"
          style={{ top: 151, gap: 22, left: 20, right: 20 }}
        >
          {summaryFlags.map((item) => {
            const flagAsset = flagsAssets[item.key as keyof typeof flagsAssets];
            if (!flagAsset) return null;
            
            const isActive = !isShareView
              ? selectedFlag === item.key
              : shareOptionKeys.includes(item.key);
            const stateAsset = isActive ? flagAsset.active : flagAsset.grey;
            
            return (
              <Image
                onClick={() => handleSelect(item.key)}
                src={stateAsset.url}
                key={item.key}
                alt={stateAsset.alt}
                width={98}
                height={50}
              />
            );
          })}
        </div>

          <div
            className="flex relative justify-end"
            style={{ gap: 22, right: 20, top: 177 }}
          >
            <div></div>
            <div className="text-white">
              <div className="text-right">没有你想要的答案？</div>
              <div className="text-right">自定义：</div>
            </div>
            {flagEmptyAsset && (
              <Image
                src={flagEmptyAsset.url}
                width={flagEmptyAsset.width / 3}
                height={flagEmptyAsset.height / 3}
                alt={flagEmptyAsset.alt}
              />
            )}
            <input
              className="absolute text-[#666]"
              style={{
                width: 80,
                top: 24,
                right: 8,
                fontSize: 22,
                textAlign: "center",
                lineHeight: "16px",
                background: "transparent",
              }}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onBlur={(e) => {
                setInputValue(e.target.value.trim().slice(0, 2));
                setSelectedFlag(null)
              }}
            />

          </div>
          <button
            className="absolute left-1/2 -translate-x-1/2 z-60 rounded-full bg-[#000] text-white text-lg"
            style={{
              minWidth: "280px",
              bottom: 100,
              height: 43
            }}
            onClick={handleGeneratePoster}
            disabled={isLoading}
          >
            {isLoading ? "生成中..." : "点击生成结果"}
          </button>
           
      </div>
    </BaseScene>
  );
}
