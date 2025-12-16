"use client";

import { useState, useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaskPosition(Number(e.target.value));
  };

  // Handle scroll/wheel events and touch events to change mask position
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

    // Touch event handlers for mobile devices
    let touchStartY = 0;
    let lastTouchY = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        lastTouchY = touchStartY;
        isTouching = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length !== 1) return;
      
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchY;
      
      // Convert touch movement to mask position change
      // Moving down (positive deltaY) should increase mask position (move right)
      // Moving up (negative deltaY) should decrease mask position (move left)
      const delta = deltaY > 0 ? 10 : -10;
      
      setMaskPosition(prev => {
        const newValue = prev + delta;
        return Math.max(-600, Math.min(0, newValue)); // Clamp between min and max
      });
      
      lastTouchY = currentY;
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Add event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

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
  const floatPulse = isMaskPastThreshold ? { scale: [1, 1.06, 1] } : { scale: 1 };
  const floatPulseTransition = isMaskPastThreshold
    ? {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2,
        ease: "easeInOut" as const,
      }
    : undefined;
  const floatPulseB = isMaskAboveThreshold ? { scale: [1, 1.06, 1] } : { scale: 1 };
  const floatPulseTransitionB = isMaskAboveThreshold
    ? {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2,
        ease: "easeInOut" as const,
      }
    : undefined;

  
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
      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
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
        {/* Invisible range input for touch/mobile support */}
        <input
          type="range"
          min="-375"
          max="0"
          value={maskPosition}
          onChange={handleRangeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-none z-50"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}