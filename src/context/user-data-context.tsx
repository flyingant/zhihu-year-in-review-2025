"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";
import request from "@/lib/request";

interface UserData {
  address?: unknown;
  pointsTask?: unknown;
}

interface UserDataContextType {
  userData: UserData | null;
  isLoadingData: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  clearError: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingData(true);
    setError(null);
    try {
      // Fetch address info
      const addressData = await request({
        url: "/campaigns/user/address",
        method: "get",
      });

      // Fetch points task info
      const pointsTaskData = await request({
        url: "/campaigns/user/1974495708519367443",
        method: "get",
      });

      setUserData({
        address: addressData,
        pointsTask: pointsTaskData,
      });
    } catch (err: unknown) {
      console.error("Error fetching user data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoadingData(false);
    }
  }, [isAuthenticated]);

  // Automatically fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
    } else if (!isAuthenticated) {
      // Clear data when user logs out
      setUserData(null);
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, fetchUserData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoadingData,
        error,
        fetchUserData,
        clearError,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

