"use client";

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useSceneTheme, useSceneThemeStyles } from '@/hooks/useSceneTheme';
import { SCENES } from '@/data/reportConfig';

interface BaseSceneProps {
  children: ReactNode;
  onNext?: () => void;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  sceneName?: string;
}

/**
 * Debug Panel Component
 */
function DebugPanel({ sceneName, onNext, theme }: { sceneName?: string; onNext?: () => void; theme: ReturnType<typeof useSceneTheme> }) {
  // Only show in development
  const isDev = process.env.NODE_ENV === 'development';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDev) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
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
    if (typeof window !== 'undefined') {
      // Update hash using history API
      // Ensure trailing slash for consistency with Next.js trailingSlash: true config
      let pathname = window.location.pathname;
      if (pathname !== '/' && !pathname.endsWith('/')) {
        pathname = `${pathname}/`;
      }
      const newUrl = `${pathname}#${sceneId}`;
      window.history.replaceState(null, '', newUrl);
      // Manually trigger hashchange event for SceneManager to pick up
      // Using a custom event since HashChangeEvent constructor may not be available
      const hashChangeEvent = new Event('hashchange', { bubbles: true });
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
            Scene: <span className="text-yellow-300">{sceneName || 'Unknown'}</span>
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
                      sceneId === sceneName ? 'bg-blue-500/50 text-yellow-300' : 'text-white'
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
}: BaseSceneProps) {
  const theme = useSceneTheme();
  const styles = useSceneThemeStyles();

  return (
    <div
      className={`relative z-30 w-full h-full`}
      style={{
        ...styles,
        width: "100%",
        maxWidth: '420px',
      }}
    >
      <DebugPanel sceneName={sceneName} onNext={onNext} theme={theme} />
      <div className={`relative z-40 w-full h-full pt-[120px]`}>
        {children}
      </div>
    </div>
  );
}

