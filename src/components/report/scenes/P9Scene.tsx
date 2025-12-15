"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P9Scene({ onNext, sceneName }: PageProps) {
  const { assets } = useAssets();
  const [maskPosition, setMaskPosition] = useState(-50);
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

  const p9Assets = assets.report.p9;
  const bgAsset = p9Assets.bg;
  const pixelBgAsset = assets.report.bg;
  const blue1Asset = pixelBgAsset.blue1;
  const mix3Asset = pixelBgAsset.mix3;
  const topAsset = p9Assets.top;
  const middleAsset = p9Assets.middle;
  const liukanshanAsset = p9Assets.liukanshan;

  
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
        {/* Background layer - static */}
        <Image 
          src={bgAsset.url} 
          alt={bgAsset.alt} 
          width={bgAsset.width} 
          height={bgAsset.height} 
          className="relative z-10 w-auto h-full pointer-events-none select-none" 
        />
        {/* Liukanshan character */}
        <div className="absolute inset-0 z-50 pointer-events-none" style={{ top: '56%', left: '19%' }}>
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
          min="-600"
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