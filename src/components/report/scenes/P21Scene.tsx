"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAssets } from "@/context/assets-context";
import BaseScene from "./BaseScene";
import { colorClass, typographyClass } from "@/lib/scene-theme";

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
      setMaskPosition((prev) => {
        const newValue = prev + delta;
        return Math.max(-600, Math.min(0, newValue)); // Clamp between min and max
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  if (!assets) return null;

  const p21Assets = assets.report.p21;
  const bgAsset = p21Assets.bg;
  const topAsset = p21Assets.top;
  const middleAsset = p21Assets.middle;
  const liukanshanAsset = p21Assets.liukanshan;

  const { mix21_1, mix21_2, mix21_3, mix21_4 } = assets.report.bg;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
      >
        <div className="absolute inset-0 z-30">
          {/* descending order */}
          <Image
            src={mix21_1.url}
            alt="{mix21_1.alt}"
            width={mix21_1.width}
            height={mix21_1.height}
            className="object-contain absolute top-[222px] left-[304px] pointer-events-none select-none z-1"
          />
          <Image
            src={mix21_2.url}
            alt="{mix21_2.alt}"
            width={mix21_2.width}
            height={mix21_2.height}
            className="object-contain absolute top-[351px] left-[236px] pointer-events-none select-none z-1"
          />
          <Image
            src={mix21_3.url}
            alt="{mix21_3.alt}"
            width={mix21_3.width}
            height={mix21_3.height}
            className="object-contain absolute top-[711px] left-0 pointer-events-none select-none z-1"
          />
          <Image
            src={mix21_4.url}
            alt="{mix21_4.alt}"
            width={mix21_4.width}
            height={mix21_4.height}
            className="object-contain absolute top-[492px] left-[30px] pointer-events-none select-none z-1"
          />
        </div>
        {/* Background layer - static */}
        <Image
          src={bgAsset.url}
          alt={bgAsset.alt}
          width={bgAsset.width}
          height={bgAsset.height}
          className="relative z-10 w-auto h-full pointer-events-none select-none"
        />
        {/* Liukanshan character */}
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ top: "51%", left: "26%" }}
        >
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
            maskSize: "auto 100%",
            maskRepeat: "no-repeat",
            maskPosition: `${maskPosition}px center`,
            maskMode: "alpha",
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
          style={{ pointerEvents: "auto" }}
        />
        {/* content **/}
        <div className="z-0">
          <div
            className={`${colorClass("yellow")} ${typographyClass(
              "title"
            )} absolute top-[114px] left-[70px] right-[70px] z-20 text-center leading-relaxed`}
          >
            这一年，
            <br />
            你如何与世界过招？
          </div>
          <div
            className={`${colorClass("yellow")} ${typographyClass(
              "title"
            )} absolute top-[625px] left-[23px] z-20 text-center leading-relaxed`}
          >
            A. 寻着光
            <br />
            探索未知
          </div>{" "}
          <div
            className={`${colorClass("yellow")} ${typographyClass(
              "title"
            )} absolute top-[286px] left-[230px] z-20 text-center leading-relaxed`}
          >
            B.跟着图
            <br />
            奔向目标
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
