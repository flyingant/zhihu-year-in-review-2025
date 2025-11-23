// components/KVSection.jsx
import React from 'react';
import Image from 'next/image';
import { assets, asset, AssetMetadata } from '@/lib/assets';


type DanmakuItem = {
  id: number;
  asset: AssetMetadata;
  marginLeft: number;
  marginBottom: number;
};

const KVSection = () => {
  const danmakusBg = asset(assets.kv.bg) as AssetMetadata;

  const danmakus: DanmakuItem[] = [
    { id: 1, asset: asset(assets.kv.danmakus[0]) as AssetMetadata, marginLeft: 42, marginBottom: 8 },
    { id: 2, asset: asset(assets.kv.danmakus[1]) as AssetMetadata, marginLeft: 5, marginBottom: -20 },
    { id: 3, asset: asset(assets.kv.danmakus[2]) as AssetMetadata, marginLeft: 140, marginBottom: 5 },
    { id: 4, asset: asset(assets.kv.danmakus[3]) as AssetMetadata, marginLeft: 117, marginBottom: -5 },
    { id: 5, asset: asset(assets.kv.danmakus[4]) as AssetMetadata, marginLeft: 220, marginBottom: -15 },
    { id: 6, asset: asset(assets.kv.danmakus[5]) as AssetMetadata, marginLeft: 0, marginBottom: 0 },
  ];

  const renderDanmakuList = (list: DanmakuItem[], keyPrefix = '') => (
    <div className="flex flex-col min-w-[100vw] md:min-w-[600px]">
      {list.map((item) => (
        <div
          key={`${keyPrefix}${item.id}`}
          className="inline-flex items-start flex-shrink-0"
          style={{
            marginLeft: `${item.marginLeft}px`,
            marginBottom: `${item.marginBottom}px`,
          }}
        >
          <Image
            src={item.asset.url}
            alt={item.asset.alt}
            width={item.asset.width}
            height={item.asset.height}
            className="h-[22px] w-auto object-contain drop-shadow-md"
            draggable="false"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-screen max-h-[460px] overflow-hidden flex flex-col items-center">

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex flex-col justify-start pt-5">
        <div className="animate-marquee whitespace-nowrap flex">
          {renderDanmakuList(danmakus, 'original-')}
          {renderDanmakuList(danmakus, 'duplicate-')}
        </div>
      </div>

      <div className="relative z-20 mt-33 flex flex-col items-center w-full px-4">
        <div className="w-full relative h-auto">
          <Image
            src={danmakusBg.url}
            alt={danmakusBg.alt}
            width={danmakusBg.width}
            height={danmakusBg.height}
            className="w-full h-auto drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default KVSection;