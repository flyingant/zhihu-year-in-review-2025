// components/report/scenes/LoadingScene.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';

interface LoadingSceneProps {
  onNext: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function LoadingScene({ onNext, sceneName }: LoadingSceneProps) {
  const { assets } = useAssets();
  const [progress, setProgress] = useState(0);
  const gif1LoadedRef = useRef(false);
  const gif2LoadedRef = useRef(false);
  const gif3LoadedRef = useRef(false);

  useEffect(() => {
    if (!assets) return
    if (!gif1LoadedRef.current) {
      const img1 = new globalThis.Image();
      img1.src = assets.report.intro.step1.url || ''
      img1.onload = () => {
        gif1LoadedRef.current = true;
      }
    }
    if (!gif2LoadedRef.current) {
      const img2 = new globalThis.Image();
      img2.src = assets.report.intro.step2.url || ''
      img2.onload = () => {
        gif2LoadedRef.current = true;
      }
    }
    if (!gif3LoadedRef.current) {
      const img3 = new globalThis.Image();
      img3.src = assets.report.intro.step3.url || ''
      img3.onload = () => {
        gif3LoadedRef.current = true;
      }
    }
  }, [assets])

  // 模拟加载进度
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          if (gif1LoadedRef.current && gif2LoadedRef.current && gif3LoadedRef.current) {
            clearInterval(timer);
            return 100
          } else {
            return 99;
          }
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onNext]);

  // 进度完成后进入下一页
  useEffect(() => {
    if (progress < 100) return;
    const timeoutId = setTimeout(() => {
      onNext();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [progress, onNext]);

  if (!assets) return null;

  const loadingAsset = assets.report.loading;
  const loadingBarAsset = assets.report.loadingBar;

  const blue1Asset = assets.report.bg.blue0_1;
  const blue2Asset = assets.report.bg.blue0_2;
  const blue3Asset = assets.report.bg.blue0_3;
  const blue4Asset = assets.report.bg.blue0_4;
  const greenAsset = assets.report.bg.green0;
  const mix1Asset = assets.report.bg.mix0_1;
  const mix2Asset = assets.report.bg.mix0_2;
  const mix3Asset = assets.report.bg.mix0_3;
  const mix4Asset = assets.report.bg.mix0_4;
  const mix5Asset = assets.report.bg.mix0_5;

  return (
    <BaseScene
      onNext={onNext}
      disableSwipe={true}
      sceneName={sceneName}
      showBottomNextButton={false}
    >
      <GlitchLayer intensity='heavy'>
        {/* 顺序从上到下 */}
        <Image
          src={blue1Asset.url}
          alt='{blue1Asset.alt}'
          width={blue1Asset.width}
          height={blue1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '99px', right: '32px' }}
        />
        <Image
          src={mix1Asset.url}
          alt='{mix1Asset.alt}'
          width={mix1Asset.width}
          height={mix1Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '130px', left: '83px' }}
        />
        <Image
          src={mix2Asset.url}
          alt='{mix2Asset.alt}'
          width={mix2Asset.width}
          height={mix2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '153px', right: '112px' }}
        />
        <Image
          src={blue2Asset.url}
          alt='{blue2Asset.alt}'
          width={blue2Asset.width}
          height={blue2Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '253px', right: '93px' }}
        />
        <Image
          src={blue3Asset.url}
          alt='{blue3Asset.alt}'
          width={blue3Asset.width}
          height={blue3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '306px', left: '144px' }}
        />
        <Image
          src={mix3Asset.url}
          alt='{mix3Asset.alt}'
          width={mix3Asset.width}
          height={mix3Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '362px', right: '97px' }}
        />
        <Image
          src={mix4Asset.url}
          alt='{mix4Asset.alt}'
          width={mix4Asset.width}
          height={mix4Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '262px', right: '0px' }}
        />
        <Image
          src={mix5Asset.url}
          alt='{mix5Asset.alt}'
          width={mix5Asset.width}
          height={mix5Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '128px', left: '28px' }}
        />
        <Image
          src={greenAsset.url}
          alt='{greenAsset.alt}'
          width={greenAsset.width}
          height={greenAsset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '134px', left: '7px' }}
        />
        <Image
          src={blue4Asset.url}
          alt='{blue4Asset.alt}'
          width={blue4Asset.width}
          height={blue4Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '44px', right: '41px' }}
        />
      </GlitchLayer>
      <div className='w-full h-full'>
        {/* <PixelGlitchOverlay /> */}
        <div className='relative z-20 flex flex-col items-center justify-center h-full'>
          <div className='relative'>
            <Image
              src={loadingAsset.url}
              alt={loadingAsset.alt}
              width={loadingAsset.width / 4}
              height={loadingAsset.height / 4}
              className='relative z-10'
              style={{ paddingBottom: '15px' }}
              unoptimized
            />
          </div>

          {/* 进度条 */}
          <div className='relative w-64 h-6'>
            {/* Progress fill - behind the background */}
            <motion.div
              className='absolute inset-0 h-ful'
              initial={{ width: 0 }}
              animate={{ width: `${progress - 2}%` }}
              style={{ zIndex: 1, backgroundColor: '#34C2FD', left: '3px' }}
            />
            {/* Background image - on top */}
            <div
              className='absolute inset-0'
              style={{
                height: '25px',
                top: '-1px',
                backgroundImage: `url(${loadingBarAsset.url})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          </div>
          <p className='font-bold tracking-widest text-black'>
            LOADING... {progress}%
          </p>
        </div>
      </div>
    </BaseScene>
  );
}
