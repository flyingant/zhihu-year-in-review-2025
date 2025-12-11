// components/report/scenes/LoadingScene.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';

interface LoadingSceneProps {
  onNext: () => void;
  sceneName?: string;
}

export default function LoadingScene({ onNext, sceneName }: LoadingSceneProps) {
  const { assets } = useAssets();
  const [progress, setProgress] = useState(0);

  // 模拟加载进度
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // setTimeout(onNext, 500); // 加载完延迟 0.5s 跳转
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onNext]);

  if (!assets) return null;

  const loadingAsset = assets.report.loading;
  const loadingBarAsset = assets.report.loadingBar;

  return (
    <BaseScene 
      onNext={undefined} 
      sceneName={sceneName}
    >
      <div className='w-full h-full'>
        {/* <PixelGlitchOverlay /> */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full space-y-8">
          <div className="relative">
            <Image
              src={loadingAsset.url}
              alt={loadingAsset.alt}
              width={loadingAsset.width / 4}
              height={loadingAsset.height / 4}
              className="relative z-10"
              unoptimized
            />
          </div>

          {/* 进度条 */}
          <div className="relative w-64 h-6">
            {/* Progress fill - behind the background */}
            <motion.div
              className="absolute inset-0 h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ zIndex: 1 }}
            />
            {/* Background image - on top */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${loadingBarAsset.url})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            />
          </div>
          <p className="font-mono font-bold tracking-widest text-black">LOADING... {progress}%</p>
        </div>
      </div>
    </BaseScene>
  );
}