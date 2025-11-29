"use client";
// components/KVSection.jsx
import React from 'react';
import Image from 'next/image';
import { useAssets, AssetMetadata } from '@/context/assets-context';
import SidebarCampaignRules from '@/components/ui/SidebarCampaignRules';


type DanmakuItem = {
  id: number;
  asset: AssetMetadata;
  marginLeft: number;
  marginBottom: number;
  duration: number;
};

const KVSection = () => {
  const { assets } = useAssets();

  if (!assets) return null;

  const danmakusBg = assets.kv.bg;

  const danmakus: DanmakuItem[] = [
    { id: 1, asset: assets.kv.danmakus[0], marginLeft: 40, marginBottom: -5, duration: 9 },
    { id: 2, asset: assets.kv.danmakus[1], marginLeft: 370, marginBottom: -6, duration: 12 },
    { id: 3, asset: assets.kv.danmakus[2], marginLeft: 140, marginBottom: 0, duration: 8 },
    { id: 4, asset: assets.kv.danmakus[3], marginLeft: 420, marginBottom: -4, duration: 11 },
    { id: 5, asset: assets.kv.danmakus[4], marginLeft: 10, marginBottom: -7, duration: 12 },
    { id: 6, asset: assets.kv.danmakus[5], marginLeft: 350, marginBottom: 0, duration: 10 },
  ];

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center">

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex flex-col justify-start pt-5">
        {danmakus.map((item) => {
          const isOdd = item.id % 2 !== 0;
          return (
            <div
              key={item.id}
              className="w-full overflow-hidden"
              style={{
                marginBottom: `${item.marginBottom}px`
              }}
            >
              <div className="w-full animate-slide-in">
                <div
                  className="flex w-max animate-marquee"
                  style={{ animationDuration: `${item.duration}s` }}
                >
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="flex min-w-[200vw] items-start relative"
                    >
                      <div
                        className="inline-flex flex-shrink-0"
                        style={{
                          left: isOdd ? '0%' : '100%',
                          marginLeft: isOdd ? `${item.marginLeft}px` : `calc(${item.marginLeft}px + 50px)`
                        }}
                      >
                        <Image
                          src={item.asset.url}
                          alt={item.asset.alt}
                          width={item.asset.width}
                          height={item.asset.height}
                          className="h-[22px] w-auto object-contain"
                          draggable="false"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-20 mt-[132px] flex flex-col items-center w-full px-4">
        <div className="w-full relative h-auto">
          <Image
            src={danmakusBg.url}
            alt={danmakusBg.alt}
            width={danmakusBg.width}
            height={danmakusBg.height}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Sidebar Campaign Rules */}
      <SidebarCampaignRules />
    </div >
  );
};

export default KVSection;