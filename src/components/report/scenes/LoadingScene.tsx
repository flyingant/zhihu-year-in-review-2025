// components/report/scenes/LoadingScene.tsx
import { motion } from 'framer-motion';
import Image from 'next/image'; // 1. 引入 Image
import PixelGlitchOverlay from '@/components/report/effects/PixelGlitchOverlay';
import { useEffect, useState } from 'react';

export default function LoadingScene({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);

  // 模拟加载进度
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onNext, 500); // 加载完延迟 0.5s 跳转
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/home_bg@3x.png"
          alt="Background"
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>
      <PixelGlitchOverlay />

      <div className="relative z-20 flex flex-col items-center justify-center h-full space-y-8">
        <div className="relative">
          <Image
            src="/assets/sidebar_liukanshan.png"
            alt="Liukanshan"
            width={78}
            height={128}
            className="relative z-10"
            priority
          />
        </div>

        {/* 进度条 */}
        <div className="w-64 h-6 border-2 border-black p-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <motion.div
            className="h-full bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-mono font-bold tracking-widest text-black">LOADING... {progress}%</p>
      </div>
    </>
  );
}