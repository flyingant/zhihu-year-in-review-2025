"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";
import request from "@/lib/request";
import { getMomentLightList, MomentLightItem, lightUpMoment, MomentPosition } from "@/api/campaign";

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
  momentLightList?: MomentLightItem[];
}

interface UserDataContextType {
  userData: UserData | null;
  isLoadingData: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  clearError: () => void;
  lightUpMomentAndRefresh: (position: MomentPosition) => Promise<void>;
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

  const fetchMomentLightList = useCallback(async () => {
    try {
      const momentLightListData = await getMomentLightList();
      console.log('momentLightListData', momentLightListData);
      setUserData((prev) => ({
        ...(prev || {}),
        momentLightList: momentLightListData.list,
      }));
    } catch (err: unknown) {
      console.error("Error fetching moment light list:", err);
      // Don't set error for moment light list as it's not critical
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

  // Fetch master config and moment light list on mount (public data, doesn't require auth)
  useEffect(() => {
    fetchMasterConfig();
    fetchMomentLightList();
  }, [fetchMasterConfig, fetchMomentLightList]);

  // Automatically fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchUserData();
      // Refresh moment light list on login to get user-specific status if API returns different data when authenticated
      fetchMomentLightList();
    } else if (!isAuthenticated) {
      // Clear user-specific data when user logs out, but keep master config and moment light list
      setUserData((prev) => ({
        masterConfig: prev?.masterConfig,
        momentLightList: prev?.momentLightList,
      }));
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, fetchUserData, fetchMomentLightList]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Light up a moment and refresh the moment light list
  const lightUpMomentAndRefresh = useCallback(async (position: MomentPosition) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      // Call the API to light up the moment
      await lightUpMoment(position);
      
      // Refresh the moment light list to get updated status
      await fetchMomentLightList();
    } catch (err: unknown) {
      console.error(`Error lighting up moment for position ${position}:`, err);
      // Don't throw error, just log it
    }
  }, [isAuthenticated, fetchMomentLightList]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        isLoadingData,
        error,
        fetchUserData,
        clearError,
        lightUpMomentAndRefresh,
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

