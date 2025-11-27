"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Type for Zhihu Hybrid SDK function
 * Based on tech specs: zhihuHybrid is a function that takes action and params
 * Example: window.zhihuHybrid('base/downloadImage', { url: '...' })
 */
type ZhihuHybridFunction = (action: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    zhihuHybrid?: ZhihuHybridFunction;
  }
}

/**
 * React hook to detect if Zhihu Hybrid SDK is available and provide image download functionality
 * @returns {object} { isAvailable: boolean, downloadImage: (url: string) => void }
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
   * Download image using zhihuHybrid SDK
   * Based on tech specs: uses 'base/downloadImage' action
   * @param url - The image URL to download
   */
  const downloadImage = useCallback((url: string) => {
    if (!isAvailable || !window.zhihuHybrid) {
      console.warn('zhihuHybrid SDK is not available');
      return;
    }

    if (!url) {
      console.warn('Image URL is required');
      return;
    }

    try {
      // Call zhihuHybrid SDK to download image
      // Action: 'base/downloadImage'
      // Params: { url: string }
      window.zhihuHybrid('base/downloadImage', {
        url: url,
      });
    } catch (error) {
      console.error('Failed to download image via zhihuHybrid:', error);
    }
  }, [isAvailable]);

  return { isAvailable, downloadImage };
}

