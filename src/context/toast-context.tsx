"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Inject toast animation styles
  useEffect(() => {
    const styleId = 'toast-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-[50%] translate-y-1/2 z-[10001] pointer-events-none" style={{ left: 0, right: 0 }}>
        <div className="flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-black text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto animate-slideUp min-w-[200px] max-w-[90vw] text-center"
              onClick={() => removeToast(toast.id)}
              style={{ margin: '0 auto' }}
            >
              <p className="text-sm text-white">{toast.message}</p>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

