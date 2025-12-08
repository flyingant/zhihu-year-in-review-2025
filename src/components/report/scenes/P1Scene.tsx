"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P1Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables

  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        过渡页...P1
      </div>
    </BaseScene>
  );
}