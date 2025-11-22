"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useUserData } from "@/context/user-data-context";
import LoginModal from "../ui/LoginModal";

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
  const { isAuthLoading, isAuthenticated, profile } = useAuth();
  const { isLoadingData, error, fetchUserData } = useUserData();
  const [showLoginModal, setShowLoginModal] = useState(false);

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

      {/* Login Prompt (if not authenticated) */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="mx-4 mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-center">
          <p className="text-gray-700 mb-3">登录后查看您的年度盘点</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            立即登录
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

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}

