"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { useUserData } from "@/context/user-data-context";

interface AuthWrapperProps {
  children: ReactNode;
  showLoginPrompt?: boolean;
  showWelcomeMessage?: boolean;
  showLoadingIndicator?: boolean;
}

export default function AuthWrapper({
  children,
  showLoginPrompt = true,
  showWelcomeMessage = true,
  showLoadingIndicator = true,
}: AuthWrapperProps) {
  const { isAuthLoading, isAuthenticated, profile, login } = useAuth();
  const { isLoadingData, error, fetchUserData } = useUserData();

  // Show loading state while checking auth
  if (isAuthLoading && showLoadingIndicator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Auth Status Indicator */}
      {showWelcomeMessage && isAuthenticated && profile && (
        <div className="px-4 py-2 text-sm text-gray-600 text-center">
          欢迎回来，{profile.name || profile.username || "用户"}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
          <button
            onClick={fetchUserData}
            className="ml-2 text-red-600 underline hover:text-red-800"
          >
            重试
          </button>
        </div>
      )}

      {/* Login Button (if not authenticated) */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="mx-4 mt-4 text-center">
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            登录
          </button>
        </div>
      )}

      {/* Loading Data Indicator */}
      {isAuthenticated && isLoadingData && (
        <div className="mx-4 mt-4 p-3 bg-gray-50 rounded text-center text-sm text-gray-600">
          正在加载您的数据...
        </div>
      )}

      {children}
    </>
  );
}

