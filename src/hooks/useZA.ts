"use client";

import { useEffect, useRef, useState } from 'react';
// 1. 依然引入包，为了触发它的副作用（注入全局变量脚本）
import za from 'za-js-sdk';

declare global {
  interface Window {
    zap?: {
      Client: new (config: { useProto3: boolean; debug?: boolean }) => any;
    };
  }
}

type ZAElementLocation = {
  moduleId: string;
  moduleIndex?: number;
  type?: string;
  text?: string;
  content?: {
    type?: string;
    id?: string;
    token?: string;
  };
};

export const useZA = () => {
  const clientRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (clientRef.current) return;

    let intervalId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 20;
    const intervalTime = 150;

    const initSDK = () => {
      if (typeof window !== 'undefined' && window.zap && window.zap.Client) {
        try {
          clientRef.current = new window.zap.Client({
            useProto3: true,
            debug: true
          });
          setIsReady(true);
          if (intervalId) clearInterval(intervalId);
          return true;
        } catch (e) {
          console.error('ZA Init Error:', e);
        }
      }
      return false;
    };

    // 有时候window.zap会提示不存在，需要轮询初始化，否则会降级到v2版本
    if (!initSDK()) {
      intervalId = setInterval(() => {
        attempts++;
        const success = initSDK();

        if (success) {
          clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
          console.warn('⚠️ window.zap.Client timeout, falling back to default za');
          clientRef.current = za;
          if (typeof za.config === 'function') {
            za.config({ useProto3: true });
          }
          setIsReady(true);
          clearInterval(intervalId);
        }
      }, intervalTime);
    }

    // 清理函数
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // --- 1. 页面曝光 ---
  const trackPageShow = () => {
    if (clientRef.current) {
      clientRef.current.trackPageShow();
    }
  };

  // --- 2. 页面消失 ---
  const trackPageDisappear = () => {
    if (clientRef.current) {
      clientRef.current.trackEvent({
        action: 'PageDisappear',
        elementLocation: { type: 'Page' }
      });
    }
  };

  // --- 3. 模块/元素曝光 ---
  const trackShow = (location: ZAElementLocation, extra?: Record<string, any>) => {
    if (!clientRef.current) return;
    const payload = { ...location, type: location.type || 'Button' };

    clientRef.current.trackShow({
      elementLocation: payload
    }, extra);
    console.log(`ZA: Show`, payload);
  };

  // --- 4. 交互点击  --- 
  const trackEvent = (action: string, location: ZAElementLocation, extra?: Record<string, any>) => {
    if (!clientRef.current) return;
    const payload = { ...location, type: location.type || 'Button' };

    clientRef.current.trackEvent({
      action: !action ? null : action,
      elementLocation: payload
    }, extra);
    console.log(`ZA: Event(${action})`, payload);
  };

  return {
    isReady,
    trackPageShow,
    trackPageDisappear,
    trackShow,
    trackEvent,
  };
};