"use client";

import { useState, useEffect } from 'react';

/**
 * Interface for Zhihu Hybrid SDK
 * Based on tech specs: provides capabilities like login, image saving, QR code recognition, etc.
 */
interface ZhihuHybridSDK {
  // User login capabilities
  login?: () => void;
  
  // Image and QR code capabilities
  saveImage?: (url: string) => void;
  recognizeQRCode?: (imageUrl: string) => void;
  
  // Navigation capabilities
  openPage?: (url: string) => void;
  
  // Data statistics (ZA platform)
  trackEvent?: (event: string, data?: any) => void;
  
  // Other capabilities as per tech specs
  [key: string]: any;
}

/**
 * React hook to detect if Zhihu Hybrid SDK is available
 * @returns {object} { isAvailable: boolean, sdk: ZhihuHybridSDK | null, capabilities: string[] }
 */
export function useZhihuHybrid() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [sdk, setSdk] = useState<ZhihuHybridSDK | null>(null);
  const [capabilities, setCapabilities] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Check for Zhihu Hybrid SDK in common global object names
    // Typical patterns: window.ZhihuHybrid, window.zhihu, window.ZhihuBridge, etc.
    const checkSDK = () => {
      const possibleSDKNames = [
        'ZhihuHybrid',
        'zhihu',
        'ZhihuBridge',
        'zhihuBridge',
        'ZhihuSDK',
        'zhihuSDK',
      ];

      let foundSDK: ZhihuHybridSDK | null = null;
      
      for (const name of possibleSDKNames) {
        const sdkObj = (window as any)[name];
        if (sdkObj && typeof sdkObj === 'object') {
          foundSDK = sdkObj as ZhihuHybridSDK;
          break;
        }
      }

      if (foundSDK) {
        setIsAvailable(true);
        setSdk(foundSDK);
        
        // Detect available capabilities
        const detectedCapabilities: string[] = [];
        if (foundSDK.login) detectedCapabilities.push('login');
        if (foundSDK.saveImage) detectedCapabilities.push('saveImage');
        if (foundSDK.recognizeQRCode) detectedCapabilities.push('recognizeQRCode');
        if (foundSDK.openPage) detectedCapabilities.push('openPage');
        if (foundSDK.trackEvent) detectedCapabilities.push('trackEvent');
        
        // Check for ZA platform (data statistics)
        if ((window as any).za || (window as any).Za) {
          detectedCapabilities.push('zaAnalytics');
        }
        
        setCapabilities(detectedCapabilities);
      } else {
        setIsAvailable(false);
        setSdk(null);
        setCapabilities([]);
      }
    };

    // Check immediately
    checkSDK();

    // Also check after a short delay in case SDK loads asynchronously
    const timeoutId = setTimeout(checkSDK, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return { isAvailable, sdk, capabilities };
}

