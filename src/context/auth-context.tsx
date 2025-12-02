"use client";

import { authRequest } from "@/lib/request";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
interface AuthContextType {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  fetchProfile: () => void;
  clear: () => void;
  profile: any;
  login: (signinBase?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    setIsAuthLoading(true);
    const defaultCookie = process.env.NEXT_PUBLIC_ZHIHU_COOKIE;
    if (defaultCookie) {
      defaultCookie
        .split(";")
        .forEach((i) => (document.cookie = i + "; path=/"));
    }
    try {
      const profile = await authRequest({
        method: "get",
        url: "/me",
      });
      setProfile(profile);
      setIsAuthenticated(true);
      // Clear redirect flag on successful auth
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_redirecting');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setProfile(null);
      console.error('Auth check failed:', error);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    // call zhihu profile to check is logged in
    fetchProfile();
  }, [fetchProfile]);

  const clear = () => {
    setProfile(null);
    setIsAuthenticated(false);
  };

  const login = useCallback((signinBase?: string) => {
    // Don't redirect if already on signin page
    if (typeof window !== 'undefined' && window.location.href.includes('/signin')) {
      return;
    }
    
    // Prevent multiple redirects
    if (typeof window !== 'undefined') {
      const isRedirecting = sessionStorage.getItem('auth_redirecting') === 'true';
      if (isRedirecting) {
        return;
      }
      sessionStorage.setItem('auth_redirecting', 'true');
    }
    
    const baseUrl = signinBase || 'https://www.zhihu.com/signin';
    if (typeof window !== 'undefined') {
      window.location.href = `${baseUrl}?next=${encodeURIComponent(
        window.location.href
      )}`;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        isAuthenticated,
        profile,
        clear,
        fetchProfile,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
