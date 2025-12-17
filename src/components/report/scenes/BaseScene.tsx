"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSceneThemeStyles } from "@/hooks/useSceneTheme";
import { SCENES } from "@/data/reportConfig";
import { useAssets } from "@/context/assets-context";
import { motion } from "framer-motion";

interface BaseSceneProps {
  children: ReactNode;
  onNext?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  sceneName?: string;
  defaultLogo?: boolean;
  showBottomNextButton?: boolean;
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
  const isDev = process.env.NODE_ENV === "development";
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
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
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
    } else if (typeof window !== "undefined") {
      // Fallback: Update URL parameter and reload (only if navigation function not available)
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('scene', sceneId);
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
      window.location.reload();
    }
  };

  const sceneList = Object.keys(SCENES);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-xs text-white">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="font-mono font-semibold whitespace-nowrap">
            Scene:{" "}
            <span className="text-yellow-300">{sceneName || "Unknown"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Scene Navigation Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="px-3 py-1 bg-purple-500/80 hover:bg-purple-500 text-white rounded text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Navigate ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded shadow-lg min-w-[150px] max-h-[300px] overflow-y-auto z-50">
                {sceneList.map((sceneId) => (
                  <button
                    key={sceneId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSceneSelect(e, sceneId);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/20 transition-colors ${
                      sceneId === sceneName
                        ? "bg-blue-500/50 text-yellow-300"
                        : "text-white"
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
              className="px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Audio Player Component
 * Fixed audio play/pause button that appears on all pages
 */
function AudioPlayer() {
  const { assets } = useAssets();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const iconDisable = assets?.report.audio.iconDisable;
  const iconPlaying = assets?.report.audio.iconPlaying;
  const audioUrl = assets?.report.audio.bgAudio?.url;

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  if (!iconDisable || !iconPlaying || !audioUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />
      <button
        onClick={togglePlayPause}
        className="absolute top-4 right-4 cursor-pointer " style={{ zIndex: 9999 }}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        <Image
          src={isPlaying ? iconPlaying.url : iconDisable.url}
          alt={isPlaying ? iconPlaying.alt : iconDisable.alt}
          width={iconDisable.width / 2}
          height={iconDisable.height / 2}
          className="object-contain"
        />
      </button>
    </>
  );
}

export default function BaseScene({
  children,
  onNext,
  onNavigateToScene,
  sceneName,
  defaultLogo = true,
  showBottomNextButton = true,
}: BaseSceneProps) {
  const { assets } = useAssets();
  const styles = useSceneThemeStyles();
  const logoAsset = assets?.kv.logo;
  const logoWhiteAsset = assets?.kv.logoWhite;
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (typeof window !== "undefined") {
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
    window.addEventListener("resize", calculateScale);

    return () => {
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  return (
    <div
      className="relative z-30 w-full h-full bg-transparent flex items-center justify-center text-[#000]"
      style={{
        ...styles,
      }}
    >
      <div
        ref={containerRef}
        className="relative bg-transparent"
        style={{
          width: "375px",
          height: "812px",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <DebugPanel sceneName={sceneName} onNext={onNext} onNavigateToScene={onNavigateToScene} />
        <div className={`relative z-40 w-full h-full`}>
          <AudioPlayer />
          {logoAsset ? (
            <div
              className={`absolute z-50`}
              style={{ top: "58px", left: "140px" }}
            >
              {defaultLogo ? (
                <Image
                  src={logoAsset.url}
                  alt={logoAsset.alt}
                  width={logoAsset.width / 2}
                  height={logoAsset.height / 2}
                  className="object-contain"
                />
              ) : logoWhiteAsset ? (
                <Image
                  src={logoWhiteAsset.url}
                  alt={logoWhiteAsset.alt}
                  width={logoWhiteAsset.width / 2}
                  height={logoWhiteAsset.height / 2}
                  className="object-contain"
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
              className="absolute left-0 right-0 bottom-6 z-60 mx-auto px-5 py-2 rounded-full bg-black/80 text-white text-sm font-semibold shadow-lg flex items-center justify-center w-fit"
              aria-label="Next"
              animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <svg
                width="28"
                height="20"
                viewBox="0 0 36 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L18 18L32 6"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
