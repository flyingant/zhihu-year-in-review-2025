"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { submitQuizAnswer } from "@/api/report";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P9Scene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();
  const [maskPosition, setMaskPosition] = useState(-190);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskPosition(Number(e.target.value));
  };

  const handleSelect = async (choice: "A" | "B") => {
    setUserChoice("p9", choice);
    // call API to record the choice
    try {
      await submitQuizAnswer({
        question_id: 2,
        answer: choice,
      });
    } catch (error) {
      console.error("Failed to submit quiz answer:", error);
      // Continue to next scene even if API call fails
    }
    onNext?.();
  };

  if (!assets) return null;

  const p9Assets = assets.report.p9;
  const bgAsset = p9Assets.bg;
  const pixelBgAsset = assets.report.bg;
  const blue1Asset = pixelBgAsset.blue1;
  const mix3Asset = pixelBgAsset.mix3;
  const topAsset = p9Assets.top;
  const middleAsset = p9Assets.middle;
  const liukanshanAsset = p9Assets.liukanshan;

  const isMaskPastThreshold = maskPosition < -190;
  const isMaskAboveThreshold = maskPosition > -190;
  const floatPulse = isMaskPastThreshold
    ? { scale: [1, 1.2, 1], opacity: 1 }
    : { scale: 1, opacity: 0 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 1.2,
          ease: "easeInOut" as const,
        },
        opacity: {
          duration: 0.5,
          ease: "easeInOut" as const,
        },
      }
    : {
        opacity: {
          duration: 0.5,
          ease: "easeInOut" as const,
        },
      };
  const floatPulseB = isMaskAboveThreshold
    ? { scale: [1, 1.06, 1], opacity: 1 }
    : { scale: 1, opacity: 0 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        scale: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 1.2,
          ease: "easeInOut" as const,
        },
        opacity: {
          duration: 0.5,
          ease: "easeInOut" as const,
        },
      }
    : {
        opacity: {
          duration: 0.5,
          ease: "easeInOut" as const,
        },
      };

  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
    <GlitchLayer className="z-[40]">
        <Image 
          src={blue1Asset.url} 
          alt="" 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ 
            top: '72px', 
            left: '40px', 
            transform: 'scale(0.8) rotate(180deg)'
          }}
        />
        <Image 
          src={mix3Asset.url} 
          alt={mix3Asset.alt} 
          width={mix3Asset.width} 
          height={mix3Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '359px', left: '0px', transform: 'rotate(180deg) scaleY(-1)' }}
        />
        <Image 
          src={blue1Asset.url} 
          alt="" 
          width={blue1Asset.width} 
          height={blue1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ 
            bottom: '144px', 
            right: '0px', 
            transform: 'rotate(180deg)' 
          }}
        />
      </GlitchLayer> 
      <div className="relative w-full h-full overflow-hidden">
        <p className="absolute z-30 text-center text-xl w-full" style={{ top: '106px' }}>回望这一年，<br/>哪一份收获更「真」？</p>
        <motion.p 
          className="absolute z-[70] text-center text-xl text-r-yellow cursor-pointer" 
          style={{ width: '188px', bottom: '146px', left: '22px', pointerEvents: 'auto' }}
          animate={floatPulse}
          transition={floatPulseTransition}
          onClick={() => handleSelect("A")}
          role="button"
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', color: '#2AAE9D' }}>
          A.思考与哲理的启发 
          </span>
        </motion.p>
        <motion.p 
          className="absolute z-[70] text-center text-xl text-r-blue cursor-pointer" 
          style={{ width: '163px', bottom: '79px', right: '33px', pointerEvents: 'auto' }}
          animate={floatPulseB}
          transition={floatPulseTransitionB}
          onClick={() => handleSelect("B")}
          role="button"
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', color: '#F47246' }}>
          B.知识与经验的输入 
          </span>
        </motion.p>

        {/* Background layer - static */}
        <Image 
          src={bgAsset.url} 
          alt={bgAsset.alt} 
          width={bgAsset.width} 
          height={bgAsset.height} 
          className="relative z-10 w-auto h-full pointer-events-none select-none" 
        />
        {/* Liukanshan character */}
        <div className="absolute inset-0 z-50 pointer-events-none" style={{ top: '49%', left: '26%' }}>
          <Image 
            src={liukanshanAsset.url} 
            alt={liukanshanAsset.alt} 
            width={liukanshanAsset.width} 
            height={liukanshanAsset.height} 
            className="object-contain pointer-events-none select-none" 
          />
        </div>
        {/* Top layer with wiper mask effect using new middle image + vertical line gradient */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            maskImage: `url("${middleAsset.url}")`,
            WebkitMaskImage: `url("${middleAsset.url}")`,
            maskSize: 'auto 100%',
            maskRepeat: 'no-repeat',
            maskPosition: `${maskPosition}px center`,
            maskMode: 'alpha'
          }}
        >
          <Image 
            src={topAsset.url} 
            alt={topAsset.alt} 
            width={topAsset.width / 2} 
            height={topAsset.height} 
            className="w-full h-full pointer-events-none select-none" 
          />
        </div>
        {/* Range input displayed at the bottom */}
        <input
          type="range"
          min="-375"
          max="0"
          value={maskPosition}
          onChange={handleRangeChange}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 z-50"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}