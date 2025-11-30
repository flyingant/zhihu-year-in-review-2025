"use client";

import React, { useState, useEffect, useRef } from 'react';
import ZaiZhiHuLianJieZhenShi from '@/components/ui/ZaiZhiHuLianJieZhenShi';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { useAssets } from '@/context/assets-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';

const ZaiZhiHuLianJieZhenShiSection = () => {
  const lastExposedIndex = useRef<number | null>(null);
  const { assets } = useAssets();
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView: moduleInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (moduleInView) {
      // 埋点17
      trackShow({ moduleId: 'carousel_subvenue_2025', type: 'Block' });
    }
  }, [moduleInView]);

  if (!assets) return null;

  const slides = assets.zaiZhiHuLianJieZhenShiUrls.map((item, index) => {
    return {
      id: index,
      ...item,
    };
  });

  const handleSlideClick = (item: any, index: number) => {
    //模块18
    trackEvent('OpenUrl', {
      moduleId: 'carousel_subvenue_image_2025',
      type: 'Block',
      moduleIndex: index
    });
  };

  const handleSlideExposure = (swiper: SwiperType) => {
    const currentIndex = swiper.realIndex;

    // 防止重复上报（如果在同一个 index 上微动）
    if (lastExposedIndex.current === currentIndex) return;
    lastExposedIndex.current = currentIndex;
    //埋点19
    trackShow({
      moduleId: 'carousel_subvenue_image_2025',
      type: 'Block',
    }, {
      link: {
        url: 'https://www.zhihu.com/question/1974440788541793545'
      }
    });
  };

  return (
    <div ref={moduleRef} className="relative w-full flex flex-col">
      {/* Title */}
      <div className="mb-4">
        <ZaiZhiHuLianJieZhenShi />
      </div>

      <div className="w-full pb-7
        /* 默认圆点样式*/
        [&_.swiper-pagination-bullet]:!bg-[#acacac] 
        [&_.swiper-pagination-bullet]:!w-[6px] 
        [&_.swiper-pagination-bullet]:!h-[6px]
        [&_.swiper-pagination-bullet]:!mx-[2px]

        /* 激活圆点样式 (选中) */
        [&_.swiper-pagination-bullet-active]:!w-[8px]
        [&_.swiper-pagination-bullet-active]:!h-[8px]
      ">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={2}
          slidesPerView={'auto'}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: paginationEl,
          }}
          onSlideChange={(swiper) => handleSlideExposure(swiper)}
          onInit={(swiper) => handleSlideExposure(swiper)}
          className="w-full"
        >
          {slides.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className="!w-[75%]"
            >
              {({ isActive }) => (
                <div
                  onClick={() => handleSlideClick(item, index)}
                  className={`
                    relative w-full h-full rounded-lg overflow-hidden transition-all duration-300 ease-out
                    ${isActive ? 'scale-100' : 'scale-90 opacity-80'}
                  `}
                >
                  {/* todo 只是为了展示 有真实图片后需要删除*/}
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    {item.alt}
                  </div>
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-pagination-container flex justify-center items-center mt-4 w-full"
          ref={(node) => setPaginationEl(node)}></div>
      </div>
    </div>
  );
};

export default ZaiZhiHuLianJieZhenShiSection;

