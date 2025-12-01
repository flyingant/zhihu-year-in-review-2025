"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Type for Zhihu Hybrid SDK (new API pattern)
 * Based on tech specs: window.zhihuHybrid('base/downloadImage').dispatch(params: Params): PromiseObservable<Result>
 */
interface PromiseObservable<T> extends Promise<T> {
  subscribe?: (callback: (result: T) => void) => void;
}

interface ZhihuHybridAction {
  dispatch(params: Record<string, unknown>): PromiseObservable<unknown>;
}

interface ZhihuHybridNewAPI {
  (action: string): ZhihuHybridAction;
}

// Legacy API type (for backward compatibility check)
type ZhihuHybridLegacy = (action: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    zhihuHybrid?: ZhihuHybridNewAPI | ZhihuHybridLegacy;
  }
}

/**
 * React hook to detect if Zhihu Hybrid SDK is available and provide image download functionality
 * @returns {object} { isAvailable: boolean, downloadImage: (url: string) => Promise<void> }
 */
export function useZhihuHybrid() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Check if zhihuHybrid SDK is available
    // The SDK is loaded from https://unpkg.zhimg.com/zhihu-hybrid@2.80.2
    const checkSDK = () => {
      const zhihuHybrid = window.zhihuHybrid;
      // Check if it's a function (supports both new and legacy API patterns)
      const available = typeof zhihuHybrid === 'function';
      setIsAvailable(available);
    };

    // Check immediately
    checkSDK();

    // Also check after a short delay in case SDK loads asynchronously
    const timeoutId = setTimeout(checkSDK, 100);

    // Listen for SDK load events if needed
    const checkInterval = setInterval(checkSDK, 500);
    
    // Stop checking after 5 seconds to avoid infinite checking
    const maxCheckTimeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(checkInterval);
      clearTimeout(maxCheckTimeout);
    };
  }, []);

  /**
   * Download image using zhihuHybrid SDK (new API pattern)
   * Based on tech specs: uses 'base/downloadImage'.dispatch(params)
   * @param url - The image URL to download
   * @returns Promise that resolves when download is initiated
   */
  const downloadImage = useCallback(async (url: string): Promise<void> => {
    if (!isAvailable || !window.zhihuHybrid) {
      console.warn('zhihuHybrid SDK is not available');
      return;
    }

    if (!url) {
      console.warn('Image URL is required');
      return;
    }

    try {
      // Use new API pattern: window.zhihuHybrid('base/downloadImage').dispatch(params)
      const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)('base/downloadImage');
      const result = hybridAction.dispatch({
        url: url,
      });
      
      // Handle PromiseObservable - can be awaited as a Promise
      await result;
    } catch (error) {
      console.error('Failed to download image via zhihuHybrid:', error);
      throw error;
    }
  }, [isAvailable]);

  return { isAvailable, downloadImage };
}

