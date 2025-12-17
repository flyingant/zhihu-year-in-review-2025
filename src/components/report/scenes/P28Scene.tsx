"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import { generateSummaryPoster } from "@/api/report";
import { useToast } from "@/context/toast-context";
import { useUserReportData } from "@/context/user-report-data-context";

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

  const flags = [
    {
      key: "cure",
      text: "被治愈",
      bg: "#FAF163",
    },
    {
      key: "get",
      text: "悟",
      bg: "#FFF59E",
    },
    {
      key: "action",
      text: "行动",
      bg: "#FF9C4B",
    },
    {
      key: "release",
      text: "释放",
      bg: "#BAC0E1",
    },
    {
      key: "live",
      text: "生活",
      bg: "#A0BDE2",
    },
    {
      key: "love",
      text: "爱",
      bg: "#FFE0E4",
    },
    {
      key: "good",
      text: "很棒",
      bg: "#FFE48D",
    },
    {
      key: "ai",
      text: "AI",
      bg: "#B6DFFE",
    },
    {
      key: "clam",
      text: "清醒",
      bg: "#B7E4F3",
    },
    {
      key: "growth",
      text: "成长",
      bg: "#F6F6C5",
    },
    {
      key: "change",
      text: "改变",
      bg: "#ECD0CD",
    },
    {
      key: "zhileng",
      text: "支棱",
      bg: "#ED6046",
    },
  ];

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
        ? flags.find((flag) => flag.key === selectedFlag)?.text || ""
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
        key: selectedFlag || "",
        bg: selectedFlag
          ? flags.find((flag) => flag.key === selectedFlag)?.bg || ""
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
      setSelectedFlag(key);
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
      {/* content */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="absolute z-0 w-auto h-full pointer-events-none select-none"
        />

        <Image
          src={
            isFriendView || isShareView
              ? titleOtherAsset.url
              : titleSelfAsset.url
          }
          alt={
            isFriendView || isShareView
              ? titleOtherAsset.alt
              : titleSelfAsset.alt
          }
          width={
            isFriendView || isShareView
              ? titleOtherAsset.width
              : titleSelfAsset.width
          }
          height={
            isFriendView || isShareView
              ? titleOtherAsset.height
              : titleSelfAsset.height
          }
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 114 }}
        />
        {isShareView && (
          <div
            className="relative"
            style={{ top: 131, gap: 22, left: 20, right: 20 }}
          >
            <Image
              src={`/assets/2025-28-banner-${summaryPoster?.key}-active.png`}
              width={330}
              height={77}
              alt="banner"
            />
          </div>
        )}
        {isShareView && (
          <div
            className="relative"
            style={{ top: 141, gap: 22, left: 20, right: 20 }}
          >
            任选三个「迷惑好友」
          </div>
        )}

        <div
          className="relative flex flex-wrap"
          style={{ top: 151, gap: 22, left: 20, right: 20 }}
        >
          {flags.map((item) => (
            <Image
              onClick={() => handleSelect(item.key)}
              src={`/assets/2025-28-flag-${item.key}-${
                !isShareView
                  ? selectedFlag === item.key
                    ? "active"
                    : "grey"
                  : shareOptionKeys.includes(item.key)
                  ? "active"
                  : "grey"
              }.png`}
              key={item.key}
              alt={item.key}
              width={98}
              height={50}
            />
          ))}
        </div>
        {!isFriendView && !isShareView && (
          <div
            className="flex relative justify-end"
            style={{ gap: 22, right: 20, top: 177 }}
          >
            <div></div>
            <div className="text-white">
              <div className="text-right">没有你想要的答案？</div>
              <div className="text-right">自定义：</div>
            </div>
            <Image
              src={`/assets/2025-28-flag-empty-self.png`}
              width={98}
              height={50}
              alt="empty"
            />
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
                if (selectedFlag) {
                  setSelectedFlag(null);
                }
                setInputValue(e.target.value);
              }}
            />
          </div>
        )}

        {isShareView ? (
          <>
            <button
              className="absolute left-1/2 -translate-x-1/2 z-60 px-8 py-3 rounded-full bg-[#000] text-white text-lg"
              style={{
                minWidth: "280px",
                bottom: 100,
              }}
              onClick={handleShare}
            >
              分享给好友猜猜
            </button>
            <label
              className="flex items-center gap-2 cursor-pointer"
              style={{
                position: "absolute",
                bottom: 70,
                left: "50%",
                transform: "translateX(-50%)",
                width: "max-content",
              }}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSynced}
                  onChange={handleSyncToggle}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    isSynced
                      ? "bg-[#00ADE9] border-[#00ADE9]"
                      : "bg-white/90 border-[#000]/30"
                  }`}
                >
                  {isSynced && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[12px] text-black font-normal">
                同步至想法，评论@好友赢周边
              </span>
            </label>
          </>
        ) : (
          <button
            className="absolute left-1/2 -translate-x-1/2 z-60 px-8 py-3 rounded-full bg-[#000] text-white text-lg"
            style={{
              minWidth: "280px",
              bottom: 160,
            }}
            onClick={handleGeneratePoster}
            disabled={isLoading}
          >
            {isLoading ? "生成中..." : "点击生成结果"}
          </button>
        )}
      </div>
    </BaseScene>
  );
}
