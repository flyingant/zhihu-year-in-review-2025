"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useUserData } from "@/context/user-data-context";
import { useZhihuApp } from "@/hooks/useZhihuApp";
import { useZhihuHybrid } from "@/hooks/useZhihuHybrid";

interface AuthWrapperProps {
  children: ReactNode;
  showWelcomeMessage?: boolean;
  showLoadingIndicator?: boolean;
}

export default function AuthWrapper({
  children,
  showWelcomeMessage = true,
  showLoadingIndicator = true,
}: AuthWrapperProps) {
  const { isAuthLoading, isAuthenticated, profile, login } = useAuth();
  const { isLoadingData, error, fetchUserData } = useUserData();
  const isZhihu = useZhihuApp();
  const { isAvailable: isHybridAvailable } = useZhihuHybrid();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      login();
    }
  }, [isAuthLoading, isAuthenticated, login]);

  // Show loading state while checking auth
  if (isAuthLoading && showLoadingIndicator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-mono text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Debug Info Panel */}
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

      {children}
    </>
  );
}

