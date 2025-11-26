"use client";

import { useState, useEffect } from 'react';
import { isZhihuApp } from '@/lib/zhihu-detection';

/**
 * React hook to detect if the page is opened within the Zhihu App
 * @returns {boolean} isZhihu - true if opened in Zhihu App, false otherwise
 */
export function useZhihuApp(): boolean {
  const [isZhihu, setIsZhihu] = useState(false);

  useEffect(() => {
    setIsZhihu(isZhihuApp());
  }, []);

  return isZhihu;
}

