// components/KVSection.jsx
import React from 'react';
import Image from 'next/image';
import { assets, asset, AssetMetadata } from '@/lib/assets';


type DanmakuItem = {
  id: number;
  asset: AssetMetadata;
  marginLeft: number;
  marginBottom: number;
  duration: number;
};

const KVSection = () => {
  const danmakusBg = asset(assets.kv.bg) as AssetMetadata;

  const danmakus: DanmakuItem[] = [
    { id: 1, asset: asset(assets.kv.danmakus[0]) as AssetMetadata, marginLeft: 42, marginBottom: 0, duration: 9 },
    { id: 2, asset: asset(assets.kv.danmakus[1]) as AssetMetadata, marginLeft: 5, marginBottom: -10, duration: 12 },
    { id: 3, asset: asset(assets.kv.danmakus[2]) as AssetMetadata, marginLeft: 140, marginBottom: 5, duration: 6 },
    { id: 4, asset: asset(assets.kv.danmakus[3]) as AssetMetadata, marginLeft: 117, marginBottom: -5, duration: 14 },
    { id: 5, asset: asset(assets.kv.danmakus[4]) as AssetMetadata, marginLeft: 120, marginBottom: -15, duration: 10 },
    { id: 6, asset: asset(assets.kv.danmakus[5]) as AssetMetadata, marginLeft: 0, marginBottom: 0, duration: 4 },
  ];

  return (
    <div className="relative w-full h-screen max-h-[430px] overflow-hidden flex flex-col items-center">

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex flex-col justify-start pt-5">
        {danmakus.map((item) => (
          <div
            key={item.id}
            className="w-full overflow-hidden"
            style={{
              marginBottom: `${item.marginBottom}px`,
            }}
          >
            <div
              className="flex w-max animate-marquee"
              style={{ animationDuration: `${item.duration}s` }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex min-w-[100vw] items-start"
                >
                  <div
                    className="inline-flex flex-shrink-0"
                    style={{
                      paddingLeft: `${item.marginLeft}px`,
                      paddingRight: '20px'
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
                </div>
              ))}
            </div>
          </div>
        ))}
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
    </div >
  );
};

export default KVSection;