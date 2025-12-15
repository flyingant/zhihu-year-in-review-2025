"use client";

import { useState } from "react";
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
  const { setSummaryPoster } = useUserReportData();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!assets) return null;

  const handleGeneratePoster = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!inputValue.trim()) {
      showToast("请输入文字", "error");
      return;
    }

    setIsLoading(true);
    try {
      const text = `${inputValue.trim()}`;
      const response = await generateSummaryPoster({ text });
      
      // Save poster data to context
      setSummaryPoster({
        poster_id: response.poster_id,
        poster_url: response.poster_url,
        text: text,
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


  return (
    <BaseScene onNext={onNext} sceneName={sceneName} showBottomNextButton={false}>
      {/* content */}
      <div
        className="absolute z-0 leading-relaxed"
        style={{ fontSize: 14, top: "114px", left: "40px", right: "72px" }}
      >
        Summary Page
      </div>
      
      {/* Input field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="输入文字..."
        className="absolute left-1/2 -translate-x-1/2 bottom-24 z-60 px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-300 text-black text-sm focus:outline-none focus:border-blue-500"
        style={{
          width: "280px",
        }}
      />
      
      {/* Black button at bottom */}
      <button
        className="absolute left-1/2 -translate-x-1/2 bottom-6 z-60 px-8 py-3 rounded-full bg-black text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          minWidth: "280px",
        }}
        onClick={handleGeneratePoster}
        disabled={isLoading}
      >
        {isLoading ? "生成中..." : "点击生成结果"}
      </button>
    </BaseScene>
  );
}

