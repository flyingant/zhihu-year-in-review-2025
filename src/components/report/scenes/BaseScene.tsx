"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSceneThemeStyles } from "@/hooks/useSceneTheme";
import { SCENES } from "@/data/reportConfig";
import { useAssets } from "@/context/assets-context";

interface BaseSceneProps {
  children: ReactNode;
  onNext?: () => void;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  sceneName?: string;
  defaultLogo?: boolean;
}

/**
 * Debug Panel Component
 */
function DebugPanel({
  sceneName,
  onNext,
}: {
  sceneName?: string;
  onNext?: () => void;
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
    if (typeof window !== "undefined") {
      // Update hash using history API
      // Ensure trailing slash for consistency with Next.js trailingSlash: true config
      let pathname = window.location.pathname;
      if (pathname !== "/" && !pathname.endsWith("/")) {
        pathname = `${pathname}/`;
      }
      const newUrl = `${pathname}#${sceneId}`;
      window.history.replaceState(null, "", newUrl);
      // Manually trigger hashchange event for SceneManager to pick up
      // Using a custom event since HashChangeEvent constructor may not be available
      const hashChangeEvent = new Event("hashchange", { bubbles: true });
      window.dispatchEvent(hashChangeEvent);
      setIsDropdownOpen(false);
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
 * Base scene component that provides consistent styling
 * All scene components can use this as a wrapper
 */
export default function BaseScene({
  children,
  onNext,
  sceneName,
  defaultLogo = true,
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
      className="relative z-30 w-full h-full bg-transparent flex items-center justify-center"
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
        <DebugPanel sceneName={sceneName} onNext={onNext} />
        <div className={`relative z-40 w-full h-full`}>
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
        </div>
      </div>
    </div>
  );
}
