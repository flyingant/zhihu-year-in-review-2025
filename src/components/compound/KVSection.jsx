// components/KVSection.jsx
import React from 'react';
import Image from 'next/image';

// todo 把6张背景图合并成一张

const KVSection = () => {
    const danmakus = [
    { id: 1, img: '/assets/danmaku_1.png', width: 277, marginLeft: 42, marginBottom: 8 },
    { id: 2, img: '/assets/danmaku_2.png', width: 114, marginLeft: 0, marginBottom: -15 },
    { id: 3, img: '/assets/danmaku_3.png', width: 215, marginLeft: 140, marginBottom: 5 },
    { id: 4, img: '/assets/danmaku_4.png', width: 250, marginLeft: 7, marginBottom: -5 },
    { id: 5, img: '/assets/danmaku_5.png', width: 102, marginLeft: 260,  marginBottom: -10 },
    { id: 6, img: '/assets/danmaku_6.png', width: 100, marginLeft: 0,  marginBottom: 0 },
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
            src={item.img} 
            alt="弹幕" 
            width={item.width} 
            height={22}
            className="h-[22px] w-auto object-contain drop-shadow-md" 
            style={{ width: item.width, height: '22px' }}
            draggable="false"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-screen max-h-[460px] overflow-hidden flex flex-col items-center">
      <div className="relative z-50 mt-5">
        <Image 
          src="/assets/zhihu_logo.png"
          alt="Zhihu Logo"
          width={187}  
          height={36}
          className="w-[93.5px] h-[18px] object-contain"
        />
      </div>
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image 
          src="/assets/bg_2025.png" 
          alt="Background 2025" 
          fill
          className="object-contain" 
          priority
        />
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none flex flex-col justify-start pt-15">
        <div className="animate-marquee whitespace-nowrap flex" style={{ animation: 'my-marquee 12s linear infinite' }}>
          {renderDanmakuList(danmakus, 'original-')}
          {renderDanmakuList(danmakus, 'duplicate-')}
        </div>
      </div>

      <div className="relative z-20 mt-32 flex flex-col items-center w-full px-4">
        <div className="w-full max-w-[245px] relative h-auto">
          <Image 
            src="/assets/subtitle_text.png" 
            alt="到底什么是真的？" 
            width={245} 
            height={107}
            className="w-full h-auto drop-shadow-lg" 
          />
        </div>

        <div className="w-full flex justify-between max-w-[350px] relative bottom-[-45px]">
            <Image 
              src="/assets/kv_tag.png" alt="Artificial or authentic"
              width={350} height={16} className="h-4 w-auto" />
        </div>

        <div className="w-full max-w-[68px]">
           <Image 
             src="/assets/kv_liukanshan.png" 
             alt="刘看山和文字" 
             width={68}
             height={75}
             className="w-full h-auto" 
           />
        </div>
        <div className="w-full max-w-[167px]">
           <Image 
             src="/assets/kv_intro.png" 
             alt="文字" 
             width={167}
             height={88}
             className="w-full h-auto" 
           />
        </div>
      </div>
    </div>
  );
};

export default KVSection;