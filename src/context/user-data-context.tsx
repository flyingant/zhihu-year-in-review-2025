"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";
import request from "@/lib/request";

export interface MasterConfigItem {
  image_url: string;
  jump_url: string;
}

export interface MasterConfig {
  self_answer: MasterConfigItem[];
  real_link: MasterConfigItem[];
}

interface UserData {
  address?: unknown;
  pointsTask?: unknown;
  masterConfig?: MasterConfig;
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

  const fetchMasterConfig = useCallback(async () => {
    try {
      const masterConfigData = await request<MasterConfig>({
        url: "/campaigns/v2/2025/master_config",
        method: "get",
      });

      setUserData((prev) => ({
        ...prev,
        masterConfig: masterConfigData,
      }));
    } catch (err: unknown) {
      console.error("Error fetching master config:", err);
      // Don't set error for master config as it's not critical
    }
  }, []);

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

      setUserData((prev) => ({
        ...prev,
        address: addressData,
      }));
    } catch (err: unknown) {
      console.error("Error fetching user data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoadingData(false);
    }
  }, [isAuthenticated]);

  // Fetch master config on mount (public data, doesn't require auth)
  useEffect(() => {
    fetchMasterConfig();
  }, [fetchMasterConfig]);

  // Automatically fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
    } else if (!isAuthenticated) {
      // Clear user-specific data when user logs out, but keep master config
      setUserData((prev) => ({
        masterConfig: prev?.masterConfig,
      }));
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

