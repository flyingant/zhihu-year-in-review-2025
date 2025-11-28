"use client";

import React, { useState } from 'react';
import ZaiZhiHuLianJieZhenShi from '@/components/ui/ZaiZhiHuLianJieZhenShi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { useAssets } from '@/context/assets-context';

const ZaiZhiHuLianJieZhenShiSection = () => {
  const { assets } = useAssets();
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);

  if (!assets) return null;

  const slides = assets.zaiZhiHuLianJieZhenShiUrls.map((item, index) => {
    return {
      id: index,
      ...item
    };
  });
  return (
    <div className="relative w-full flex flex-col">
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
          className="w-full"
        >
          {slides.map((item) => (
            <SwiperSlide
              key={item.id}
              className="!w-[75%]"
            >
              {({ isActive }) => (
                <div
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

