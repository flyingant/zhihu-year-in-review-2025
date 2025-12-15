"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAssets } from '@/context/assets-context';
import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P1Scene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const { setUserChoice } = useUserReportData();
  const [maskPosition, setMaskPosition] = useState(-75);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskPosition(Number(e.target.value));
  };

  // Handle scroll/wheel events to change mask position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 10 : -10; // Scroll down increases, up decreases
      setMaskPosition(prev => {
        const newValue = prev + delta;
        return Math.max(-600, Math.min(0, newValue)); // Clamp between min and max
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleSelect = (choice: "A" | "B") => {
    setUserChoice("p1", choice);
    onNext?.();
  };


  if (!assets) return null;

  const p1Assets = assets.report.p1;
  const reportBgAsset = assets.report.bg;
  const mixAsset = reportBgAsset.mix0_1;
  const blue2Asset = reportBgAsset.blue2;
  const mix1Asset = reportBgAsset.mix1;
  const mix2Asset = reportBgAsset.mix2;

  const bgAsset = p1Assets.bg;
  const topAsset = p1Assets.top;
  const middleAsset = p1Assets.middle;
  const liukanshanReadingAsset = p1Assets.liukanshanReading;

  const isMaskPastThreshold = maskPosition < -300;
  const isMaskAboveThreshold = maskPosition > -300;
  const floatPulse = isMaskPastThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2,
        ease: "easeInOut" as const,
      }
    : undefined;
  const floatPulseB = isMaskAboveThreshold
    ? { scale: [1, 1.06, 1] }
    : { scale: 1 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2,
        ease: "easeInOut" as const,
      }
    : undefined;

  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName} showBottomNextButton={false}>
      <GlitchLayer className="z-[40]">
        <Image 
          src={mixAsset.url} 
          alt="{mixAsset.alt}" 
          width={mixAsset.width} 
          height={mixAsset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '28px', left: '-30px' }} 
        />
        <Image 
          src={blue2Asset.url} 
          alt="{blue2Asset.alt}" 
          width={blue2Asset.width} 
          height={blue2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '210px', right: '39px' }} 
        />
        <Image 
          src={mix2Asset.url} 
          alt="{mix2Asset.alt}" 
          width={mix2Asset.width} 
          height={mix2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: '295px', left: '0px' }} 
        />
        <Image 
          src={mix1Asset.url} 
          alt="{mix1Asset.alt}" 
          width={mix1Asset.width} 
          height={mix1Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '155px', right: '-30px' }} 
        />
        <Image 
          src={blue2Asset.url} 
          alt="{blue2Asset.alt}" 
          width={blue2Asset.width} 
          height={blue2Asset.height} 
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ bottom: '45px', left: '45px' }} 
        />
      </GlitchLayer>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
        <p className="absolute z-30 text-center text-xl w-full" style={{ top: '106px' }}>这一年，<br/>是什么在驱动你的创作？</p>
        <motion.p 
          className="absolute z-[70] text-center text-xl text-r-yellow cursor-pointer" 
          style={{ width: '188px', top: '229px', left: '22px', pointerEvents: 'auto' }}
          animate={floatPulse}
          transition={floatPulseTransition}
          onClick={() => handleSelect("A")}
          role="button"
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', transform: 'rotate(14deg) skewX(10deg) skewY(10deg)', transformStyle: 'preserve-3d' }}>
            A.来自世界的目光和他人交流
          </span>
        </motion.p>
        <motion.p 
          className="absolute z-[70] text-center text-xl text-r-blue cursor-pointer" 
          style={{ width: '163px', bottom: '89px', right: '33px', pointerEvents: 'auto' }}
          animate={floatPulseB}
          transition={floatPulseTransitionB}
          onClick={() => handleSelect("B")}
          role="button"
          tabIndex={0}
        >
          <span style={{ display: 'inline-block', transform: 'rotate(-25deg) skewX(15deg) skewY(15deg)', transformStyle: 'preserve-3d' }}>
            B.来自内心的回声与自己对话
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
        {/* Liukanshan reading character */}
        <div className="absolute inset-0 z-50 pointer-events-none" style={{ top: '56%', left: '19%' }}>
          <Image 
            src={liukanshanReadingAsset.url} 
            alt={liukanshanReadingAsset.alt} 
            width={liukanshanReadingAsset.width} 
            height={liukanshanReadingAsset.height} 
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
            width={topAsset.width} 
            height={topAsset.height} 
            className="w-full h-full pointer-events-none select-none" 
          />
        </div>
        {/* Invisible range input for touch/mobile support */}
        <input
          type="range"
          min="-600"
          max="0"
          value={maskPosition}
          onChange={handleRangeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-none z-[60]"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}