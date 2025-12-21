'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSceneThemeStyles } from '@/hooks/useSceneTheme';
import { SCENES } from '@/data/reportConfig';
import { useAssets } from '@/context/assets-context';
import { useAudio } from '@/context/audio-context';
import { motion } from 'framer-motion';

/**
 * Audio Player UI Component
 * Renders the play/pause button using the global audio context
 */
function AudioPlayer() {
  const { assets } = useAssets();
  const { isPlaying, togglePlayPause } = useAudio();

  const iconDisable = assets?.report.audio.iconDisable;
  const iconPlaying = assets?.report.audio.iconPlaying;

  if (!iconDisable || !iconPlaying) return null;

  return (
    <button
      onClick={togglePlayPause}
      className='absolute cursor-pointer'
      style={{
        top: '16px',
        right: '16px',
        zIndex: 9999,
      }}
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      <Image
        src={isPlaying ? iconPlaying.url : iconDisable.url}
        alt={isPlaying ? iconPlaying.alt : iconDisable.alt}
        width={iconDisable.width / 2}
        height={iconDisable.height / 2}
        className='object-contain'
      />
    </button>
  );
}

interface BaseSceneProps {
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  sceneName?: string;
  defaultLogo?: boolean;
  showBottomNextButton?: boolean;
  disableSwipe?: boolean;
}

/**
 * Debug Panel Component
 */
function DebugPanel({
  sceneName,
  onNext,
  onNavigateToScene,
}: {
  sceneName?: string;
  onNext?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
}) {
  // Only show in development
  const isDev = process.env.NODE_ENV === 'development';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDev) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, isDev]);

  if (!isDev) return null;

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  const handleSceneSelect = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    if (onNavigateToScene) {
      // Use the navigation function if provided (no reload needed)
      onNavigateToScene(sceneId);
    } else if (typeof window !== 'undefined') {
      // Fallback: Update URL parameter and reload (only if navigation function not available)
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('scene', sceneId);
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
      window.location.reload();
    }
  };

  const sceneList = Object.keys(SCENES);

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/20'>
      <div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-xs text-white'>
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <div className='font-mono font-semibold whitespace-nowrap'>
            Scene:{' '}
            <span className='text-yellow-300'>{sceneName || 'Unknown'}</span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {/* Scene Navigation Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className='px-3 py-1 bg-purple-500/80 hover:bg-purple-500 text-white rounded text-xs font-semibold transition-colors whitespace-nowrap'
            >
              Navigate ▼
            </button>
            {isDropdownOpen && (
              <div className='absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded shadow-lg min-w-[150px] max-h-[300px] overflow-y-auto z-50'>
                {sceneList.map((sceneId) => (
                  <button
                    key={sceneId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSceneSelect(e, sceneId);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/20 transition-colors ${
                      sceneId === sceneName
                        ? 'bg-blue-500/50 text-yellow-300'
                        : 'text-white'
                    }`}
                  >
                    {sceneId}
                  </button>
                ))}
              </div>
            )}
          </div>
          {onNext && (
            <button
              onClick={handleNextClick}
              className='px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors whitespace-nowrap'
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BaseScene({
  children,
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
  defaultLogo = true,
  showBottomNextButton = true,
  disableSwipe = false,
}: BaseSceneProps) {
  const { assets } = useAssets();
  const styles = useSceneThemeStyles();
  const logoAsset = assets?.kv.logo;
  const logoWhiteAsset = assets?.kv.logoWhite;
  const arrowDownAsset = assets?.report.intro.arrowDown;
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hammerRef = useRef<any>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (typeof window !== 'undefined') {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const baseWidth = 375;
        const baseHeight = 812;
        const maxScale = 1.5;

        // Calculate scale based on both width and height
        // Use the minimum to ensure content fits within screen while maintaining 375:812 aspect ratio
        // CSS transform: scale() scales uniformly, preserving the aspect ratio automatically
        const widthScale = screenWidth / baseWidth;
        const heightScale = screenHeight / baseHeight;
        const newScale = Math.min(widthScale, heightScale, maxScale);

        // Only update if scale actually changed (prevents unnecessary re-renders)
        setScale((prevScale) => {
          // Round to 3 decimal places to avoid floating point precision issues
          const roundedNewScale = Math.round(newScale * 1000) / 1000;
          const roundedPrevScale = Math.round(prevScale * 1000) / 1000;
          return roundedNewScale !== roundedPrevScale ? newScale : prevScale;
        });
      }
    };

    // Calculate initial scale
    calculateScale();

    // Listen for resize events
    window.addEventListener('resize', calculateScale);

    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  // Initialize Hammer.js for swipe gestures
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Dynamically import Hammer.js only on the client side
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hammer: any = null;
    let isMounted = true;

    const initHammer = async () => {
      try {
        const Hammer = (await import('hammerjs')).default;

        if (!isMounted || !containerRef.current) return;

        // Create Hammer instance
        hammer = new Hammer(containerRef.current);
        hammerRef.current = hammer;

        // Enable swipe recognizer with vertical directions
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

        // Handle swipe up (next)
        hammer.on('swipeup', () => {
          if (!disableSwipe && onNext) {
            console.log('Swipe up detected - going to next scene');
            onNext();
          }
        });

        // Handle swipe down (previous)
        hammer.on('swipedown', () => {
          if (!disableSwipe && onPrevious) {
            console.log('Swipe down detected - going to previous scene');
            onPrevious();
          }
        });
      } catch (error) {
        console.error('Failed to load Hammer.js:', error);
      }
    };

    initHammer();

    // Cleanup
    return () => {
      isMounted = false;
      if (hammerRef.current) {
        hammerRef.current.destroy();
        hammerRef.current = null;
      }
    };
  }, [onNext, onPrevious, disableSwipe]);

  return (
    <div
      className='relative z-30 w-full h-full bg-transparent flex items-center justify-center text-[#000]'
      style={{
        ...styles,
      }}
    >
      <div
        ref={containerRef}
        className='relative bg-transparent'
        style={{
          width: '375px',
          height: '812px',
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <DebugPanel
          sceneName={sceneName}
          onNext={onNext}
          onNavigateToScene={onNavigateToScene}
        />
        {/* Audio Player - placed inside scaled container */}
        <AudioPlayer />
        <div className={`relative z-40 w-full h-full`}>
          {logoAsset ? (
            <div
              className={`absolute z-50`}
              hidden
              style={{ top: '58px', left: '140px' }}
            >
              {defaultLogo ? (
                <Image
                  src={logoAsset.url}
                  alt={logoAsset.alt}
                  width={logoAsset.width / 2}
                  height={logoAsset.height / 2}
                  className='object-contain'
                />
              ) : logoWhiteAsset ? (
                <Image
                  src={logoWhiteAsset.url}
                  alt={logoWhiteAsset.alt}
                  width={logoWhiteAsset.width / 2}
                  height={logoWhiteAsset.height / 2}
                  className='object-contain'
                />
              ) : null}
            </div>
          ) : null}
          {children}
          {onNext && showBottomNextButton && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className='absolute left-0 right-0 bottom-6 z-60 mx-auto px-5 py-2 text-sm flex items-center justify-center w-fit'
              aria-label='Next'
              animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: 'easeInOut',
              }}
            >
              {arrowDownAsset && (
                <Image
                  src={arrowDownAsset.url}
                  alt={arrowDownAsset.alt}
                  width={arrowDownAsset.width}
                  height={arrowDownAsset.height}
                  style={{ width: 20, height: 11 }}
                />
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
