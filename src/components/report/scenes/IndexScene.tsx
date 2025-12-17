// components/report/scenes/IndexScene.tsx
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import BaseScene from './BaseScene';
import { useUserReportData } from '@/context/user-report-data-context';
import { useAssets } from '@/context/assets-context';
import { formatDateWithoutText } from '@/utils/common';

interface IndexSceneProps {
  onNext?: (choice?: string) => void;
  sceneName?: string;
}

type ActiveView = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null;
interface MirrorContentProps {
  userName?: string;
  year?: string;
  month?: string;
  day?: string;
  registerDays?: number;
}

const MirrorContent = ({
  userName,
  registerDays,
  year,
  month,
  day,
}: MirrorContentProps) => (
  <div
    className='flex flex-col justify-center text-left pointer-events-none select-none w-full h-full'
    style={{ fontSize: '14px' }}
  >
    <div style={{ fontSize: '22px', paddingBottom: '8px' }}>
      你说，时间是真实的吗？
    </div>
    <div style={{ fontSize: '22px', paddingBottom: '8px' }}>@{userName}</div>
    <div>
      从
      <span
        className='text-r-pink'
        style={{ padding: '0px 3px', fontSize: '18px' }}
      >
        {year}
      </span>
      年
      <span
        className='text-r-pink'
        style={{ padding: '0px 3px', fontSize: '18px' }}
      >
        {month}
      </span>
      月
      <span
        className='text-r-pink'
        style={{ padding: '0px 3px', fontSize: '18px' }}
      >
        {day}
      </span>
      日 开始
    </div>
    <div>
      我们一起走过了{' '}
      <span className='text-r-yellow' style={{ fontSize: '24px' }}>
        {registerDays}
      </span>{' '}
      天真实的时间
    </div>
  </div>
);

export default function IndexScene({ onNext, sceneName }: IndexSceneProps) {
  const { assets } = useAssets();
  const { reportData } = useUserReportData();
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [expandingView, setExpandingView] = useState<ActiveView>(null);
  const [gifFirstFrame, setGifFirstFrame] = useState<string | null>(null);
  const [showAnimatedGif, setShowAnimatedGif] = useState(false);
  const [showGif, setShowGif] = useState(true);
  const gifImageRef = useRef<HTMLImageElement | null>(null);
  const gifTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract first frame from GIF
  useEffect(() => {
    if (!assets?.report?.index?.gif) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setGifFirstFrame(dataUrl);
      }
    };

    img.onerror = () => {
      console.error('Failed to load GIF for first frame extraction');
    };

    img.src = assets.report.index.gif.url;
    gifImageRef.current = img;
  }, [assets?.report?.index?.gif]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (gifTimeoutRef.current) {
        clearTimeout(gifTimeoutRef.current);
      }
    };
  }, []);

  if (!assets) return null;

  const indexAssets = assets.report.index;

  const userName = reportData?.username as string | undefined;
  const { year, month, day } = formatDateWithoutText(
    reportData?.register_date as string | undefined
  );
  const registerDays = reportData?.register_days as number | undefined;

  const handleCornerClick = (view: ActiveView) => {
    // Start expansion animation
    setExpandingView(view);
  };

  const handleExpansionComplete = () => {
    // After expansion completes, switch to background view
    if (expandingView) {
      setActiveView(expandingView);
      setExpandingView(null);
    }
  };

  const handleBackgroundClick = () => {
    setActiveView(null);
  };

  // Handle next button click - show animated GIF first, then proceed after 3 seconds
  const handleNextClick = () => {
    if (!assets?.report?.index?.gif) {
      // If no GIF, proceed directly
      onNext?.();
      return;
    }

    // Show animated GIF
    setShowAnimatedGif(true);

    // Set timeout for 3 seconds, then hide GIF and proceed to next
    gifTimeoutRef.current = setTimeout(() => {
      setShowAnimatedGif(false);
      setShowGif(false);
      onNext?.();
    }, 3000);
  };

  const floatTransition = (delay = 0, duration = 2) => ({
    repeat: Infinity,
    duration: duration,
    ease: 'easeInOut' as const,
    delay,
  });

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

  // Get corner image asset based on view
  const getCornerAsset = (view: ActiveView) => {
    if (!view) return null;
    switch (view) {
      case 'topLeft':
        return indexAssets.topLeft;
      case 'topRight':
        return indexAssets.topRight;
      case 'bottomLeft':
        return indexAssets.bottomLeft;
      case 'bottomRight':
        return indexAssets.bottomRight;
      default:
        return null;
    }
  };

  // Get corner position style based on view
  const getCornerStyle = (view: ActiveView) => {
    switch (view) {
      case 'topLeft':
        return { top: '5%', left: '0' };
      case 'topRight':
        return { top: '2%', right: '0' };
      case 'bottomLeft':
        return { bottom: '13%', left: '0' };
      case 'bottomRight':
        return { bottom: '6%', right: '5px' };
      default:
        return {};
    }
  };

  const getMirrorStyle = (view: ActiveView) => {
    switch (view) {
      case 'topLeft':
        return {
          container: {
            top: '-20%',
            left: '8%',
            right: '10%',
            bottom: '25%',
          },
          style: { transform: 'rotate(10deg) skewX(10deg) skewY(10deg)' },
          zhiLinkPos: { bottom: '13%', right: '40px' },
        };
      case 'topRight':
        return {
          container: {
            top: '-30%',
            left: '35%',
            right: '-20%',
            bottom: '25%',
          },
          style: { transform: 'rotate(10deg) skewX(0deg) skewY(-20deg)' },
          zhiLinkPos: { bottom: '13%', left: '40px' },
        };
      case 'bottomLeft':
        return {
          container: {
            top: '-20%',
            left: '10%',
            right: '10%',
            bottom: '20%',
          },
          style: { transform: 'rotate(0deg) skewX(0deg) skewY(8deg)' },
          zhiLinkPos: { bottom: '13%', right: '40px' },
        };
      case 'bottomRight':
        return {
          container: {
            top: '-30%',
            left: '10%',
            right: '10%',
            bottom: '20%',
          },
          style: { transform: 'rotate(0deg) skewX(30deg) skewY(-10deg)' },
          zhiLinkPos: { bottom: '14%', right: '10px' },
        };
      default:
        return { container: {}, style: {} };
    }
  };

  const getExpandTranslation = (view: ActiveView) => {
    switch (view) {
      case 'topLeft':
        return { x: 140, y: 100 };
      case 'topRight':
        return { x: -140, y: 100 };
      case 'bottomLeft':
        return { x: 140, y: -100 };
      case 'bottomRight':
        return { x: -140, y: -100 };
      default:
        return { x: 0, y: 0 };
    }
  };
  const expandingAsset = getCornerAsset(expandingView);

  return (
    <BaseScene
      onNext={handleNextClick}
      sceneName={sceneName}
      showBottomNextButton={!!activeView}
    >
      <div className='relative w-full h-full overflow-hidden'>
        <div
          className='absolute text-[#121212] tracking-[0.2em] [writing-mode:vertical-lr]'
          style={{
            top: '110px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
          }}
        >
          选择你的方向
        </div>
        {/* Initial view - stays visible during expansion to avoid blink */}
        {!activeView && (
          <motion.div
            className='relative w-full h-full flex flex-col items-center justify-center perspective-1000'
            animate={{ opacity: expandingView ? 0.3 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Left Decoration - Clickable */}
            <motion.div
              className='absolute top-0 left-0 z-10 cursor-pointer'
              style={{ top: '5%', left: '0' }}
              animate={{ x: [0, -8, 0], y: [0, -8, 0] }}
              transition={floatTransition(0, 3)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCornerClick('topLeft')}
            >
              <Image
                src={indexAssets.topLeft.url}
                alt={indexAssets.topLeft.alt}
                width={indexAssets.topLeft.width / 3}
                height={indexAssets.topLeft.height / 3}
                className='object-contain'
              />
            </motion.div>

            {/* Top Right Decoration - Clickable */}
            <motion.div
              className='absolute top-0 right-0 z-10 cursor-pointer'
              style={{ top: '2%', right: '0' }}
              animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
              transition={floatTransition(0.2, 3)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCornerClick('topRight')}
            >
              <Image
                src={indexAssets.topRight.url}
                alt={indexAssets.topRight.alt}
                width={indexAssets.topRight.width / 3}
                height={indexAssets.topRight.height / 3}
                className='object-contain'
              />
            </motion.div>

            {/* Bottom Left Decoration - Clickable */}
            <motion.div
              className='absolute bottom-0 left-0 z-10 cursor-pointer'
              style={{ bottom: '13%', left: '0' }}
              animate={{ x: [0, -8, 0], y: [0, 8, 0] }}
              transition={floatTransition(0.4, 6)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCornerClick('bottomLeft')}
            >
              <Image
                src={indexAssets.bottomLeft.url}
                alt={indexAssets.bottomLeft.alt}
                width={indexAssets.bottomLeft.width / 3}
                height={indexAssets.bottomLeft.height / 3}
                className='object-contain'
              />
            </motion.div>

            {/* Bottom Right Decoration - Clickable */}
            <motion.div
              className='absolute bottom-0 right-0 z-10 cursor-pointer'
              style={{ bottom: '6%', right: '5px' }}
              animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
              transition={floatTransition(0.6, 5)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCornerClick('bottomRight')}
            >
              <Image
                src={indexAssets.bottomRight.url}
                alt={indexAssets.bottomRight.alt}
                width={indexAssets.bottomRight.width / 3}
                height={indexAssets.bottomRight.height / 3}
                className='object-contain'
              />
            </motion.div>

            {/* Floating Liukanshan */}
            <motion.div
              className='relative z-10'
              animate={{ y: [-2, 10, -2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Image
                src={indexAssets.liukanshan.url}
                alt={indexAssets.liukanshan.alt}
                width={indexAssets.liukanshan.width / 3}
                height={indexAssets.liukanshan.height / 3}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Expanding animation overlay - appears on top of initial view */}
        {expandingView && expandingAsset && (
          <motion.div
            className='absolute inset-0 z-50 overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Expanding image - starts at corner position, expands to fill screen */}
            <motion.div
              className='absolute z-50'
              style={{
                ...getCornerStyle(expandingView),
              }}
              initial={{
                scale: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: 3,
                ...getExpandTranslation(expandingView),
              }}
              transition={{
                duration: 2.0,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onAnimationComplete={handleExpansionComplete}
            >
              <Image
                src={expandingAsset.url}
                alt={expandingAsset.alt}
                width={expandingAsset.width / 3}
                height={expandingAsset.height / 3}
                className='object-contain'
              />
            </motion.div>
          </motion.div>
        )}

        {/* Background view */}
        <AnimatePresence mode='wait'>
          {activeView && (
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className='relative w-full h-full cursor-pointer'
              onClick={handleBackgroundClick}
            >
              {backgroundAsset && (
                <Image
                  src={backgroundAsset.url}
                  alt={backgroundAsset.alt}
                  width={backgroundAsset.width}
                  height={backgroundAsset.height}
                  className='w-full h-full object-cover'
                  priority
                />
              )}
              {indexAssets.gif && showGif && (
                <motion.div
                  className='absolute'
                  style={{ top: '300px', left: '100px' }}
                  animate={{
                    y: [-4, 8, -4],
                    x: [-2, 2, -2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                  }}
                >
                  {showAnimatedGif ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={indexAssets.gif.url}
                      alt={indexAssets.gif.alt}
                      width={indexAssets.gif.width}
                      height={indexAssets.gif.height}
                      className='object-cover'
                      style={{ display: 'block' }}
                    />
                  ) : (
                    gifFirstFrame && (
                      <Image
                        src={gifFirstFrame}
                        alt={indexAssets.gif.alt}
                        width={indexAssets.gif.width}
                        height={indexAssets.gif.height}
                        className='object-cover'
                        priority
                      />
                    )
                  )}
                </motion.div>
              )}

              <div
                className='absolute flex items-center justify-center'
                style={getMirrorStyle(activeView).container}
              >
                <div
                  style={getMirrorStyle(activeView).style}
                  className='w-full h-full'
                >
                  <MirrorContent
                    userName={userName}
                    year={year}
                    month={month}
                    day={day}
                    registerDays={registerDays}
                  />
                </div>
              </div>
              <div
                className='absolute mt-8 flex items-center text-sm font-bold text-[#121212] cursor-pointer w-fit'
                style={{
                  ...getMirrorStyle(activeView).style,
                  ...getMirrorStyle(activeView).zhiLinkPos,
                }}
                onClick={() =>
                  window.open(
                    'https://www.zhihu.com/profile?zh_hide_nav_bar=true',
                    '_blank'
                  )
                }
              >
                <span className='mr-2'>&gt;</span>
                <motion.span
                  className='underline underline-offset-4 inline-block'
                  animate={{ scale: [1, 1.09, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'easeInOut',
                  }}
                >
                  查看自己的 ZhiLink
                </motion.span>
                <span className='ml-2'>&lt;</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseScene>
  );
}
