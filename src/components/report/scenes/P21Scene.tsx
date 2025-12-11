"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P21Scene({ onNext, sceneName }: PageProps) {
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

  const p21Assets = assets.report.p21;
  const bgAsset = p21Assets.bg;
  const topAsset = p21Assets.top;
  const middleAsset = p21Assets.middle;
  const liukanshanAsset = p21Assets.liukanshan;

  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
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
        <div className="absolute inset-0 z-50 pointer-events-none" style={{ top: '51%', left: '26%' }}>
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
          min="-300"
          max="300"
          value={maskPosition}
          onChange={handleRangeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-none z-30"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}

