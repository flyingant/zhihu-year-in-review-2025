"use client";

import { useState, useEffect } from 'react';

/**
 * React hook to detect if the viewport is mobile-sized
 * @param breakpoint - The maximum width (in pixels) to consider as mobile. Default: 768px
 * @returns {boolean} isMobile - true if viewport width is mobile-sized, false otherwise
 */
export function useMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Check immediately
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

