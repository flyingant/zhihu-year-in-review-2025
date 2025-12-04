"use client";

import React, { useState, useEffect, useRef } from 'react';
import ZaiZhiHuLianJieZhenShi from '@/components/ui/ZaiZhiHuLianJieZhenShi';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { useUserData } from '@/context/user-data-context';
import { useZA } from '@/hooks/useZA';
import { useInView } from 'react-intersection-observer';
import { completeTask, getCampaignInfo } from '@/api/campaign';
import { useAssets } from '@/context/assets-context';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useZhihuApp } from '@/hooks/useZhihuApp';

const ZaiZhiHuLianJieZhenShiSection = () => {
  const { assets } = useAssets();
  const lastExposedIndex = useRef<number | null>(null);
  const hasTrackedModule = useRef(false);
  const isVisibleRef = useRef(false);
  const { userData } = useUserData();
  const [currentDotIndex, setCurrentDotIndex] = useState(0);
  const { trackShow, trackEvent } = useZA();
  const { ref: moduleRef, inView } = useInView({ threshold: 0.2 });
  const { isAvailable: isHybridAvailable, openURL } = useZhihuHybrid();
  const isZhihuApp = useZhihuApp();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);


  useEffect(() => {
    isVisibleRef.current = inView;

    if (inView && !hasTrackedModule.current) {
      //  埋点17
      trackShow({ moduleId: 'carousel_subvenue_2025', type: 'Block', page: { page_id: '60850', page_level: 1 } });
      hasTrackedModule.current = true;
    }
  }, [inView, trackShow]);

  // Use real_link from userData
  const realLinkItems = userData?.masterConfig?.real_link || [];
  const originalLength = realLinkItems.length;
  const rawSlides = realLinkItems.length > 0 && realLinkItems.length < 6
    ? [...realLinkItems, ...realLinkItems]
    : realLinkItems;

  type SlideItem = {
    id: number;
    originalIndex: number;
    url: string;
    width: number;
    height: number;
    alt: string;
    jump_url?: string;
  };

  const slides: SlideItem[] = rawSlides.map((item, index) => {
    const originalIndex = index % (realLinkItems.length || 1);
    return {
      id: index,
      originalIndex: originalIndex,
      url: item.image_url,
      width: 339, // Default width, adjust if needed
      height: 226, // Default height, adjust if needed
      alt: `在知乎链接真实 ${index + 1}`,
      jump_url: item.jump_url,
    };
  });

  const handleSlideClick = async (item: SlideItem, index: number) => {
    //模块18
    trackEvent('OpenUrl', {
      moduleId: 'carousel_subvenue_image_2025',
      type: 'Block',
      moduleIndex: item.originalIndex,
      page: { page_id: '60850', page_level: 1 }
    });

    // Call completeTask API and reload campaign data
    if (assets?.campaign) {
      completeTask(assets.campaign.completeTaskIds.BROWSE_FENHUICHANG)
        .then(() => {
          // Reload campaign data after successfully completing the task
          return getCampaignInfo(assets.campaign.activityId);
        })
        .catch((error) => {
          console.error('Error completing task BROWSE_FENHUICHANG or reloading campaign data:', error);
          // Silently fail - this is just tracking, don't block user flow
        });
    }

    // Navigate to jump_url if available
    if (item.jump_url) {
      // Navigate to URL - use zhihuHybrid if in zhihu app, otherwise use window.location.href
      const jumpUrl = item.jump_url;
      setTimeout(async () => {
        if (isZhihuApp && isHybridAvailable) {
          try {
            await openURL(jumpUrl);
          } catch (error) {
            console.error('Failed to open URL via zhihuHybrid, falling back to window.location.href:', error);
            window.location.href = jumpUrl;
          }
        } else {
          window.location.href = jumpUrl;
        }
      }, 0);
    }
  };

  const handleDotClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  const handleSlideExposure = (swiper: SwiperType) => {
    if (!isVisibleRef.current) return;
    const realIndex = swiper.realIndex;
    const actualIndex = realIndex % (originalLength || 1);
    setCurrentDotIndex(actualIndex);

    // 防止重复上报（如果在同一个 index 上微动）
    if (lastExposedIndex.current === actualIndex) return;
    lastExposedIndex.current = actualIndex;

    // Get the current slide's jump_url
    const currentSlide = slides[actualIndex];
    const jumpUrl = currentSlide?.jump_url;

    //埋点19
    trackShow({
      moduleId: 'carousel_subvenue_image_2025',
      type: 'Block',
      page: { page_id: '60850', page_level: 1 }
    }, {
      link: {
        url: jumpUrl
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
          onSlideChange={(swiper) => handleSlideExposure(swiper)}
          onInit={(swiper) => handleSlideExposure(swiper)}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          className="w-full"
        >
          {slides.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className="!w-[282px]"
            >
              {({ isActive }) => (
                <div
                  onClick={() => handleSlideClick(item, index)}
                  className={`
                    aspect-[339/226]
                    relative w-full h-full rounded-lg overflow-hidden transition-all duration-300 ease-out
                    ${isActive ? 'scale-100' : 'scale-90 opacity-80'}
                  `}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center items-center mt-4 w-full">
          {realLinkItems.map((_, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                mx-[2px] rounded-full transition-all duration-300 cursor-pointer
                ${currentDotIndex === index
                  ? 'w-[8px] h-[8px] bg-[#808080]'
                  : 'w-[6px] h-[6px] bg-[#bcbcbc]'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZaiZhiHuLianJieZhenShiSection;

