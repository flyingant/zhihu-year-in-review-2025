"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';

const QiangXianYuGaoSection = () => {
  const { assets } = useAssets();
  const { trackShow } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });


  useEffect(() => {
    if (moduleInView) {
      // 埋点12
      trackShow({ moduleId: 'annual_preview_2025', type: 'Block', page: { page_id: '60850', page_level: 1 } });
    }
  }, [moduleInView]);

  if (!assets) return null;

  const qiangXianYuGaoBanner = assets.newImages.qiangXianYuGaoBanner;

  return (
    <div id="preview-section" ref={moduleRef} className="relative w-full flex flex-col items-center pb-6">
      <div className="w-full flex items-center justify-center">
        <div className="relative w-full flex justify-center">
          <Image
            src={qiangXianYuGaoBanner.url}
            alt={qiangXianYuGaoBanner.alt}
            width={qiangXianYuGaoBanner.width}
            height={qiangXianYuGaoBanner.height}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default QiangXianYuGaoSection;

