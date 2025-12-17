"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { useUserData } from "@/context/user-data-context";
import { useZhihuApp } from "@/hooks/useZhihuApp";
import { useZhihuHybrid } from "@/hooks/useZhihuHybrid";
import { useAssets } from "@/context/assets-context";
import { useMobile } from "@/hooks/useMobile";

interface AuthWrapperProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
  showLoadingIndicator?: boolean;
  requireAuth?: boolean; // If false, allows page to be accessed without authentication
}

export default function AuthWrapper({
  children,
  showWelcomeMessage = true,
  showLoadingIndicator = true,
  requireAuth = true, // Default to true to maintain existing behavior
}: AuthWrapperProps) {
  const { isAuthLoading, isAuthenticated, profile, login } = useAuth();
  const { isLoadingData, error, fetchUserData } = useUserData();
  const isZhihu = useZhihuApp();
  const { isAvailable: isHybridAvailable } = useZhihuHybrid();
  const { assets } = useAssets();
  const isMobile = useMobile();
  const hasRedirectedRef = useRef(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Clear redirect flag on mount (user returned from login)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_redirecting');
    }
  }, []);

  // Redirect to login page if not authenticated (only if requireAuth is true)
  useEffect(() => {
    // Only redirect if:
    // 1. Auth is required (requireAuth === true)
    // 2. Auth check is complete (!isAuthLoading)
    // 3. User is not authenticated
    // 4. We haven't already redirected in this session
    // 5. Assets are loaded (or we have a fallback)
    if (requireAuth && !isAuthLoading && !isAuthenticated && !hasRedirected && !hasRedirectedRef.current) {
      // Wait for assets to load if available, but don't block if it's taking too long
      const signinBase = assets?.urls?.signinBase;
      
      // Mark as redirected to prevent multiple redirects
      hasRedirectedRef.current = true;
      setHasRedirected(true);
      
      login(signinBase);
    }
  }, [requireAuth, isAuthLoading, isAuthenticated, login, assets, hasRedirected]);

  // Show loading state while checking auth
  if (isAuthLoading && showLoadingIndicator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black font-mono text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  const isDevelopment = false;

  return (
    <>
      {/* Debug Info Panel - Only shown in development */}
      {isDevelopment && (
        <div className="bg-black text-white font-mono text-xs p-3 border-b border-gray-700">
          <div className="flex flex-col gap-1">
            {/* Auth Status Indicator */}
            {showWelcomeMessage && isAuthenticated && profile && (
              <div className="text-green-400">
                ✓ 已登录: {profile.name || profile.username || "用户"}
              </div>
            )}

            {/* Auth Loading State */}
            {isAuthLoading && (
              <div className="text-yellow-400">⏳ 检查认证状态...</div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-400">
                ✗ 错误: {error}
                <button
                  onClick={fetchUserData}
                  className="ml-2 text-white underline hover:text-gray-300"
                >
                  [重试]
                </button>
              </div>
            )}

            {/* Loading Data Indicator */}
            {isAuthenticated && isLoadingData && (
              <div className="text-yellow-400">⏳ 正在加载您的数据...</div>
            )}

            {/* Mobile Indicator */}
            <div className={isMobile ? "text-blue-400" : "text-gray-400"}>
              {isMobile ? "📱 移动端" : "💻 桌面端"}
            </div>
            
            {/* Debug Info */}
            <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
              <div>
                Auth: {isAuthenticated ? "✓" : "✗"} | 
                Loading: {isAuthLoading || isLoadingData ? "⏳" : "✓"} | 
                Environment: {isZhihu ? "📱 App内" : "🌐 浏览器"} | 
                Hybrid: {isHybridAvailable ? "✓" : "✗"}
              </div>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}

