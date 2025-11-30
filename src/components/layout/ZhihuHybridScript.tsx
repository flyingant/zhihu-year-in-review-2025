"use client";

import Script from "next/script";

/**
 * Client component wrapper for zhihu-hybrid SDK script
 * This is needed because event handlers cannot be passed to Script in server components
 */
export default function ZhihuHybridScript() {
  return (
    <Script
      src="https://unpkg.zhimg.com/zhihu-hybrid@2.80.2"
      strategy="afterInteractive"
      onError={(e) => {
        console.warn("Failed to load zhihu-hybrid SDK:", e);
      }}
    />
  );
}

