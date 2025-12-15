"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P29Scene({ onNext, sceneName }: PageProps) {
  const { summaryPoster } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName} showBottomNextButton={true}>
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
          style={{ fontSize: 14, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          暂无海报
        </div>
      )}
    </BaseScene>
  );
}

