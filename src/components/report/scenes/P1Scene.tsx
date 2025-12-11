"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P1Scene({ onNext, sceneName }: PageProps) {
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

  const p1Assets = assets.report.p1;
  const bgAsset = p1Assets.bg;
  const topAsset = p1Assets.top;
  const middleAsset = p1Assets.middle;
  const liukanshanReadingAsset = p1Assets.liukanshanReading;

  
  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ perspective: '1000px' }}>
        <p className="absolute z-30 text-center text-xl w-full" style={{ top: '106px' }}>这一年，<br/>是什么在驱动你的创作？</p>
        <p 
          className="absolute z-30 text-center text-sm" 
          style={{ width: '121px', top: '192px', left: '43px', transform: 'skew(-25deg) rotate(16deg) translateZ(20px)', transformStyle: 'preserve-3d' }}
        >
          A.来自世界的目光和他人交流
        </p>
        <p 
          className="absolute z-30 text-center text-xl" 
          style={{ width: '160px', bottom: '11px', right: '43px', transform: 'skew(25deg) rotate(-11deg) translateZ(-27px)', transformStyle: 'preserve-3d' }}
        >
          B.来自内心的回声与自己对话
        </p>
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-none z-30"
          style={{ pointerEvents: 'auto' }}
        />
      </div>
    </BaseScene>
  );
}