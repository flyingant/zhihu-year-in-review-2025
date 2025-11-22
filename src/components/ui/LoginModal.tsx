"use client";

import { useAuth } from "@/context/auth-context";

interface LoginModalProps {
  onClose?: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
        <h2 className="text-xl font-bold mb-4">登录知乎</h2>
        <p className="text-gray-600 mb-6">
          您需要登录知乎账号才能查看年度盘点内容
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            前往登录
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded cursor-pointer"
            >
              稍后再说
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

