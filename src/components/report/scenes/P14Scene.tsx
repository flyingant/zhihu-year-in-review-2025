"use client";

import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: (choice: string) => void;
  sceneName?: string;
}

export default function P14Scene({ onNext, sceneName }: PageProps) {
  const handleChoice = (e: React.MouseEvent, choice: string) => {
    e.stopPropagation();
    if (onNext) {
      onNext(choice);
    }
  };

  return (
    <BaseScene onNext={undefined} sceneName={sceneName}>
      <div className={typographyClass('large') + ' font-bold mb-[20px]'}>
        过渡页...P14
        <br />
      </div>
    </BaseScene>
  );
}

