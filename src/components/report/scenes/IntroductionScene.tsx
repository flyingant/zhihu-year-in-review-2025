// components/report/scenes/IntroductionScene.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import BaseScene from './BaseScene';

interface IntroductionSceneProps {
  onNext: () => void;
  sceneName?: string;
}

export default function IntroductionScene({ onNext, sceneName }: IntroductionSceneProps) {
  return (
    <BaseScene 
      onNext={onNext} 
      sceneName={sceneName}
      className="pt-0"
      containerClassName="w-full max-w-none"
      contentClassName="p-0"
    >
      <div className="relative w-full h-full overflow-hidden bg-white">

      {/* 1. 清晰层 (底层) */}
      {/* <div className="absolute inset-0 z-0">
        <img src="/assets/bg_clear.jpg" className="w-full h-full object-cover" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <img src="/assets/liukanshan_walk.gif" className="w-32" />
        </div>
      </div> */}

      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ clipPath: 'inset(0 0 0 100%)' }}
        animate={{ clipPath: 'inset(0 0 0 0%)' }}
        transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
      >

        <Image
          src="/assets/home_bg@3x.png"
          alt="知乎2025年度回顾背景"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="absolute top-20 left-10 z-20">
        <motion.h1
          className="text-4xl font-bold text-black"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          我的<br />真实<br />源文件
        </motion.h1>
      </div>

      {/* 引导箭头左右循环微动 */}
      <motion.div
        className="absolute bottom-10 w-full flex justify-center z-30 cursor-pointer"
        animate={{ x: [-5, 5, -5] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <div className="flex items-center gap-2 text-black font-bold">
          <span>→</span>
          <span>点击进入数据世界</span>
        </div>
      </motion.div>
      </div>
    </BaseScene>
  );
}

