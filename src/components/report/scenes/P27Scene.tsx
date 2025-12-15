"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P27Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;


  return (
    <BaseScene onNext={onNext} sceneName={sceneName} showBottomNextButton={true}>
      {/* content */}
      <div
        className="absolute z-0 leading-relaxed"
        style={{ fontSize: 14, top: "114px", left: "40px", right: "72px" }}
      >
        Summary Page
      </div>
    </BaseScene>
  );
}

