"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAssets } from '@/context/assets-context';
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P14Scene({ onNext, sceneName }: PageProps) {
  const [maskPosition, setMaskPosition] = useState(-50);
  const { assets } = useAssets();
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
 
  if (!assets) return null;

  const p14Assets = assets.report.p14 || {};
  const bgAsset = p14Assets.bg;
  const topAsset = p14Assets.top;
  const middleAsset = p14Assets.middle;
  
  const reportBg = assets.report.bg;
  const blue10Asset = reportBg.blue10;
  const mix3Asset = reportBg.mix3;
  const mix14Asset = reportBg.mix14;


  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ perspective: '1000px' }}>
        <GlitchLayer className="z-[40]">
          <Image src={mix3Asset.url} alt="{mix3Asset.alt}" width={mix3Asset.width} height={mix3Asset.height} 
            className="object-contain absolute top-[80px] right-[-40px]" />
          <Image src={blue10Asset.url} alt="" width={blue10Asset.width} height={blue10Asset.height} 
            className="object-contain absolute top-[137px] left-[14px] scale-[0.8] rotate-180" />
          <Image src={mix14Asset.url} alt="" width={mix14Asset.width} height={mix14Asset.height} 
            className="object-contain absolute bottom-[105px] left-[0px]" />
          <Image src={blue10Asset.url} alt="" width={blue10Asset.width} height={blue10Asset.height} 
            className="object-contain absolute bottom-[47px] right-[12px] rotate-180" />
        </GlitchLayer> 
        <p className="absolute z-30 text-center text-xl w-full" style={{ top: '106px' }}>
          当你赞同时，<br/>你在回应什么？
        </p>
        <p 
          className="absolute z-30 text-center text-sm font-bold text-[#FF8992] whitespace-nowrap" 
          style={{ 
              top: '260px', 
              left: '23%', 
          }}
        >
          A. 一种被<span className="ml-20">理解的感觉</span> 
        </p>
        <p 
          className="absolute z-30 text-center text-sm font-bold text-[#7E9FFF] whitespace-nowrap" 
          style={{ 
              bottom: '160px', 
              right: '15%', 
              transform: 'skewY(15deg) rotate(5deg) perspective(500px) rotateX(20deg)',
              transformOrigin: 'center'
          }}
        >
          B. 一句说得对的道理
        </p>

        <Image 
          src={bgAsset.url} 
          alt={bgAsset.alt} 
          width={bgAsset.width} 
          height={bgAsset.height} 
          className="relative z-10 w-auto h-full pointer-events-none select-none" 
        />
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-none z-30"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}