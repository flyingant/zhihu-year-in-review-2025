"use client";

import { useZhihuApp } from '@/hooks/useZhihuApp';
import { useMobile } from '@/hooks/useMobile';
import { useAssets } from '@/context/assets-context';

/**
 * Fixed bottom button that appears when:
 * - User is NOT in Zhihu App
 * - User is on mobile view
 * 
 * Clicking the button redirects to inAppRedirectionURL
 */
export default function AppRedirectButton() {
  const isZhihuApp = useZhihuApp();
  const isMobile = useMobile();
  const { assets } = useAssets();

  // Only show if NOT in Zhihu App AND on mobile
  const shouldShow = !isZhihuApp && isMobile;

  // Get the redirect URL from assets
  const redirectUrl = assets?.urls?.inAppRedirectionURL;

  if (!shouldShow || !redirectUrl) {
    return null;
  }

  const handleClick = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100 flex justify-center pb-4 pointer-events-none">
      <button
        onClick={handleClick}
        className="pointer-events-auto flex items-center gap-2 bg-[#0084FF] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#0066CC] transition-colors overflow-hidden appearance-none border-0"
        style={{ borderRadius: '9999px' }}
        aria-label="在知乎 App 内打开"
      >
        {/* Zhihu Logo SVG */}
        <svg
          width="20"
          height="14"
          viewBox="0 0 42 30"
          fill="none"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M7.223 29.227 6.52 26H4a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h34a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H13.58l-5.274 3.654a.7.7 0 0 1-1.083-.427ZM6.197 10.98c-.247.7-.852 1.929-.852 1.929s.71.01 1.314-.314c.584-.314.848-.788 1.057-1.512l.047-.159h1.196v2.875a26.8 26.8 0 0 1-.035.764H6.799c-.765 0-1.386.62-1.386 1.386h3.382c-.1.775-.24 1.425-.415 1.905-.45 1.24-.98 2.063-1.56 2.757-.534.638-1.62 1.559-1.62 1.559s1.622.615 2.81-.497c.719-.673 1.364-1.997 1.672-2.99a14.97 14.97 0 0 0 .588-2.734h3.084v-.72a.666.666 0 0 0-.666-.666H10.38c.01-.244.018-.499.02-.764v-2.874h2.644v-.677a.71.71 0 0 0-.71-.71H8.196l.043-.13c.141-.43.596-1.744.596-1.744s-.645-.042-1.248.37c-.298.202-.473.357-.711 1.016-.192.529-.37 1.045-.514 1.456l-.165.474ZM35.69 9.944l.441-.026c.2-.208.457-1.25.357-1.578-.04-.131-.11-.349-.33-.297-.583.14-1.085.244-2.215.379-1.395.164-2.022.21-3.887.346l-.154.011c-3.485.255-6.582.377-6.582.377 0 .756.63 1.36 1.385 1.328 1.18-.049 2.906-.13 4.656-.216v4.819h-6.618c0 .765.621 1.386 1.386 1.386h5.232v3.698c-.005.465-.24.625-.636.634h-2.026c.147.657.765 1.208 1.165 1.369.511.207 1.089.166 1.334.149a4.74 4.74 0 0 1 .066-.005c.706-.036 1.537-.434 1.537-1.869v-3.976h5.844a.666.666 0 0 0 .666-.666v-.72h-6.51v-4.89c2.165-.108 4.14-.21 4.889-.253Zm-21.788-.405h6.393v11.158H17.8l-2.126 1.353-.21-1.353h-1.563V9.539Zm1.441 9.772h.891l.122.79 1.242-.79h1.255v-8.386h-3.51v8.386Zm9.015-7.66 2.203 3.057 1.169-.845-1.503-2.083a1.197 1.197 0 0 0-1.674-.27l-.195.14Zm11.374-.06L33.39 14.69l-1.15-.868 1.62-2.143a1.2 1.2 0 0 1 1.676-.233l.196.146ZM9.825 18.21l1.212-.78 1.602 2.382c.25.446.187.863.147 1.134v.001c-.107.726-.35 1.161-.35 1.161l-2.61-3.898Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium whitespace-nowrap">App 内打开</span>
      </button>
    </div>
  );
}

