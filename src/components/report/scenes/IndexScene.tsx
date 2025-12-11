// components/report/scenes/IndexScene.tsx
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import BaseScene from './BaseScene';
import { useAssets } from '@/context/assets-context';

interface IndexSceneProps {
  onNext?: (choice?: string) => void;
  sceneName?: string;
}

type ActiveView = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null;

export default function IndexScene({ onNext, sceneName }: IndexSceneProps) {
  const { assets } = useAssets();
  const [activeView, setActiveView] = useState<ActiveView>(null);

  if (!assets) return null;

  const indexAssets = assets.report.index;

  const handleCornerClick = (view: ActiveView) => {
    setActiveView(view);
  };

  const handleBackgroundClick = () => {
    setActiveView(null);
  };

  // Get background image based on active view
  const getBackgroundAsset = () => {
    if (!activeView) return null;
    switch (activeView) {
      case 'topLeft':
        return indexAssets.bgTopLeft;
      case 'topRight':
        return indexAssets.bgTopRight;
      case 'bottomLeft':
        return indexAssets.bgBottomLeft;
      case 'bottomRight':
        return indexAssets.bgBottomRight;
      default:
        return null;
    }
  };

  const backgroundAsset = getBackgroundAsset();

  return (
    <BaseScene 
      onNext={onNext} 
      sceneName={sceneName}
    >
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeView ? (
            // Initial view with corner decorations
            <motion.div
              key="initial"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex flex-col items-center justify-center perspective-1000"
            >
              {/* Top Left Decoration - Clickable */}
              <motion.div
                className="absolute top-0 left-0 z-10 cursor-pointer"
                style={{ top: '5%', left: '0' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCornerClick('topLeft')}
              >
                <Image 
                  src={indexAssets.topLeft.url} 
                  alt={indexAssets.topLeft.alt} 
                  width={indexAssets.topLeft.width / 3} 
                  height={indexAssets.topLeft.height / 3} 
                  className="object-contain"
                />
              </motion.div>

              {/* Top Right Decoration - Clickable */}
              <motion.div
                className="absolute top-0 right-0 z-10 cursor-pointer"
                style={{ top: '2%', right: '0' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCornerClick('topRight')}
              >
                <Image 
                  src={indexAssets.topRight.url} 
                  alt={indexAssets.topRight.alt} 
                  width={indexAssets.topRight.width / 3} 
                  height={indexAssets.topRight.height / 3} 
                  className="object-contain"
                />
              </motion.div>

              {/* Bottom Left Decoration - Clickable */}
              <motion.div
                className="absolute bottom-0 left-0 z-10 cursor-pointer"
                style={{ bottom: '13%', left: '0' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCornerClick('bottomLeft')}
              >
                <Image 
                  src={indexAssets.bottomLeft.url} 
                  alt={indexAssets.bottomLeft.alt} 
                  width={indexAssets.bottomLeft.width / 3} 
                  height={indexAssets.bottomLeft.height / 3} 
                  className="object-contain"
                />
              </motion.div>

              {/* Bottom Right Decoration - Clickable */}
              <motion.div
                className="absolute bottom-0 right-0 z-10 cursor-pointer"
                style={{ bottom: '6%', right: '5px' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCornerClick('bottomRight')}
              >
                <Image 
                  src={indexAssets.bottomRight.url} 
                  alt={indexAssets.bottomRight.alt} 
                  width={indexAssets.bottomRight.width / 3} 
                  height={indexAssets.bottomRight.height / 3} 
                  className="object-contain"
                />
              </motion.div>

              {/* Floating Liukanshan */}
              <motion.div
                className="relative z-10"
                animate={{ y: [-2, 10, -2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Image 
                  src={indexAssets.liukanshan.url} 
                  alt={indexAssets.liukanshan.alt} 
                  width={indexAssets.liukanshan.width / 3} 
                  height={indexAssets.liukanshan.height / 3} 
                />
              </motion.div>
            </motion.div>
          ) : (
            // Background view
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full cursor-pointer"
              onClick={handleBackgroundClick}
            >
              {backgroundAsset && (
                <Image
                  src={backgroundAsset.url}
                  alt={backgroundAsset.alt}
                  width={backgroundAsset.width}
                  height={backgroundAsset.height}
                  className="w-full h-full object-cover"
                  priority
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseScene>
  );
}