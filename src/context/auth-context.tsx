"use client";

import { authRequest } from "@/lib/request";
import {
  createContext,
  useContext,
  useState,
  useEffect,
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

  const fetchProfile = async () => {
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
    } catch {
      setIsAuthenticated(false);
      setProfile(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    // call zhihu profile to check is logged in
    fetchProfile();
  }, []);

  const clear = () => {
    setProfile(null);
    setIsAuthenticated(false);
  };

  const login = (signinBase?: string) => {
    const baseUrl = signinBase || 'https://www.zhihu.com/signin';
    window.location.href = `${baseUrl}?next=${encodeURIComponent(
      window.location.href
    )}`;
  };

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
