"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { useState } from "react";
import { handleSaveImage } from "@/utils/common";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P29Scene({ onNext, sceneName }: PageProps) {
  const { summaryPoster } = useUserReportData();
  const { assets } = useAssets();
  const [isSynced, setIsSynced] = useState(false);

  if (!assets) return null;

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save clicked");
    handleSaveImage(summaryPoster?.poster_url || "");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share clicked");
  };

  const handleSyncToggle = () => {
    setIsSynced(!isSynced);
    // TODO: Implement sync functionality
  };

  const handleFriendInteraction = () => {
    // TODO: Implement friend interaction functionality
    console.log("Friend interaction clicked");
  };

  return (
    <BaseScene
      onNext={onNext}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      {/* Poster display - fullscreen */}
      {summaryPoster ? (
        <div className="absolute inset-0 z-10">
          <div className="relative w-full h-full">
            <Image
              src={summaryPoster.poster_url}
              alt="Summary Poster"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div
          className="absolute z-0 leading-relaxed text-center"
          style={{
            fontSize: 14,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          暂无海报
        </div>
      )}

      {/* Action buttons area at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-6 px-6"
        style={{
          background: summaryPoster?.bg,
        }}
      >
        {/* Friend Interaction button */}
        <button
          onClick={handleFriendInteraction}
          className="flex items-center justify-center gap-2 bg-black rounded-full text-center mb-4"
          style={{ width: "330px", height: "34px" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 9H16M8 13H12"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[14px] font-medium text-white">
            好友互动：猜猜哪个才是真的我？
          </span>
        </button>

        {/* Save and Share buttons */}
        <div className="flex gap-3 mb-4">
          {/* Save button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center"
            style={{ width: "160px", height: "34px" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16V4M12 16L8 12M12 16L16 12"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20H20"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[14px] font-medium text-[#000]">保存</span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-white rounded-full shadow-lg text-center"
            style={{ width: "160px", height: "34px" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="5"
                r="3"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="6"
                cy="12"
                r="3"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="18"
                cy="19"
                r="3"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[14px] font-medium text-[#000]">分享</span>
          </button>
        </div>

        {/* Sync checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
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
            同步至想法赢徽章
          </span>
        </label>
      </div>
    </BaseScene>
  );
}
