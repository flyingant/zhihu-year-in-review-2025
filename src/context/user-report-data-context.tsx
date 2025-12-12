"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { getUserReportData, type UserReportData } from "@/api/report";

// Re-export UserReportData for backward compatibility
export type { UserReportData };

interface UserReportDataContextType {
  reportData: UserReportData | null;
  isLoadingReport: boolean;
  error: string | null;
  fetchReportData: () => Promise<void>;
  clearError: () => void;
}

const UserReportDataContext = createContext<UserReportDataContextType | undefined>(undefined);

export function UserReportDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [reportData, setReportData] = useState<UserReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingReport(true);
    setError(null);
    try {
      const data = await getUserReportData();
      setReportData(data);
    } catch (err: unknown) {
      console.error("Error fetching user report data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取年度报告数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoadingReport(false);
    }
  }, [isAuthenticated]);

  // Automatically fetch report data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchReportData();
    } else if (!isAuthenticated) {
      // Clear report data when user logs out
      setReportData(null);
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, fetchReportData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <UserReportDataContext.Provider
      value={{
        reportData,
        isLoadingReport,
        error,
        fetchReportData,
        clearError,
      }}
    >
      {children}
    </UserReportDataContext.Provider>
  );
}

export function useUserReportData() {
  const context = useContext(UserReportDataContext);
  if (context === undefined) {
    throw new Error("useUserReportData must be used within a UserReportDataProvider");
  }
  return context;
}

