"use client";

import Image from "next/image";
import { useState } from "react";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import { setVoteOption } from "@/api/report";
import { useToast } from "@/context/toast-context";
import { useUserReportData } from "@/context/user-report-data-context";
import { summaryFlags } from "@/utils/common";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P30Scene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { showToast } = useToast();
  const { summaryPoster } = useUserReportData();

  const [shareOptionKeys, setShareOptionKeys] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState(false);

  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const bgAsset = p28Assets.bg;
  const titleOtherAsset = p28Assets.titleOther;

  const handleSelect = (key: string) => {
    if (summaryPoster?.key === key) {
      showToast("请选择与正确答案不同的选项来迷惑");
      return;
    }

    if (shareOptionKeys.includes(key)) {
      setShareOptionKeys(shareOptionKeys.filter((k) => k !== key));
    } else {
      const newKyes = [...shareOptionKeys, key];
      setShareOptionKeys(newKyes.slice(-3));
    }
  };

  const handleShare = () => {
    if (shareOptionKeys.length < 3) {
      showToast("请任选三个选项");
      return;
    }
    setVoteOption({
      poster_id: summaryPoster?.poster_id || 0,
      options: shareOptionKeys
        .map((i) => summaryFlags.find((flag) => flag.key === i)?.fullText || "")
        .filter(Boolean),
      is_publish_pin: 0,
    }).then(() => {
      // Vote options set successfully
      // Note: poll_id would need to be retrieved separately if needed
    });
  };

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
          src={titleOtherAsset.url}
          alt={titleOtherAsset.alt}
          width={titleOtherAsset.width}
          height={titleOtherAsset.height}
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 114 }}
        />
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
        <div
          className="relative"
          style={{ top: 141, gap: 22, left: 20, right: 20 }}
        >
          任选三个「迷惑好友」
        </div>

        <div
          className="relative flex flex-wrap"
          style={{ top: 151, gap: 22, left: 20, right: 20 }}
        >
          {summaryFlags.map((item) => (
            <Image
              onClick={() => handleSelect(item.key)}
              src={`/assets/2025-28-flag-${item.key}-${
                shareOptionKeys.includes(item.key) ? "active" : "grey"
              }.png`}
              key={item.key}
              alt={item.key}
              width={98}
              height={50}
            />
          ))}
        </div>

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
      </div>
    </BaseScene>
  );
}
