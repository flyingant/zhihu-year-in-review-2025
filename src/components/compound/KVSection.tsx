// components/KVSection.jsx
import React from 'react';
import Image from 'next/image';
import { assets, asset } from '@/lib/assets';

// todo 把6张背景图合并成一张

const KVSection = () => {
  const subtitleAsset = asset(assets.kv.subtitle);
  const tagAsset = asset(assets.kv.tag);
  const liukanshanAsset = asset(assets.kv.liukanshan);
  const introAsset = asset(assets.kv.intro);

  const danmakus = [
    { id: 1, asset: asset(assets.kv.danmakus[0]), marginLeft: 42, marginBottom: 8 },
    { id: 2, asset: asset(assets.kv.danmakus[1]), marginLeft: 0, marginBottom: -15 },
    { id: 3, asset: asset(assets.kv.danmakus[2]), marginLeft: 140, marginBottom: 5 },
    { id: 4, asset: asset(assets.kv.danmakus[3]), marginLeft: 7, marginBottom: -5 },
    { id: 5, asset: asset(assets.kv.danmakus[4]), marginLeft: 260, marginBottom: -10 },
    { id: 6, asset: asset(assets.kv.danmakus[5]), marginLeft: 0, marginBottom: 0 },
  ];

  const renderDanmakuList = (list, keyPrefix = '') => (
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
            style={{ width: `${item.asset.width}px`, height: `${item.asset.height}px` }}
            draggable="false"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-screen max-h-[460px] overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src={asset(assets.kv.background)}
          alt="Background 2025"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex flex-col justify-start pt-6">
        <div className="animate-marquee whitespace-nowrap flex">
          {renderDanmakuList(danmakus, 'original-')}
          {renderDanmakuList(danmakus, 'duplicate-')}
        </div>
      </div>

      <div className="relative z-20 mt-32 flex flex-col items-center w-full px-4">
        <div className="w-full relative h-auto" style={{ maxWidth: `${subtitleAsset.width}px` }}>
          <Image
            src={subtitleAsset.url}
            alt={subtitleAsset.alt}
            width={subtitleAsset.width}
            height={subtitleAsset.height}
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        <div className="w-full flex justify-between relative bottom-[-45px]" style={{ maxWidth: `${tagAsset.width}px` }}>
          <Image
            src={tagAsset.url}
            alt={tagAsset.alt}
            width={tagAsset.width}
            height={tagAsset.height}
            className="h-4 w-auto"
          />
        </div>

        <div className="w-full relative h-auto" style={{ maxWidth: `${liukanshanAsset.width}px` }}>
          <Image
            src={liukanshanAsset.url}
            alt={liukanshanAsset.alt}
            width={liukanshanAsset.width}
            height={liukanshanAsset.height}
            className="w-full h-auto"
          />
        </div>
        <div className="w-full relative h-auto" style={{ maxWidth: `${introAsset.width}px` }}>
          <Image
            src={introAsset.url}
            alt={introAsset.alt}
            width={introAsset.width}
            height={introAsset.height}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default KVSection;