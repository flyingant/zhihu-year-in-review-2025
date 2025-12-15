"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "./auth-context";
import { getUserReportData, type UserReportData, type GenerateSummaryPosterResponse } from "@/api/report";

// Re-export UserReportData for backward compatibility
export type { UserReportData };

interface SummaryPosterData {
  poster_id: number;
  poster_url: string;
  text: string;
}

interface UserReportDataContextType {
  reportData: UserReportData | null;
  isLoadingReport: boolean;
  error: string | null;
  fetchReportData: () => Promise<void>;
  clearError: () => void;
  userChoices: Record<string, string>;
  setUserChoice: (sceneName: string, choice: string) => void;
  getUserChoice: (sceneName: string) => string | undefined;
  summaryPoster: SummaryPosterData | null;
  setSummaryPoster: (poster: SummaryPosterData) => void;
}

const UserReportDataContext = createContext<UserReportDataContextType | undefined>(undefined);

export function UserReportDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState<UserReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userChoices, setUserChoicesState] = useState<Record<string, string>>({});
  const [summaryPoster, setSummaryPosterState] = useState<SummaryPosterData | null>(null);

  const fetchReportData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingReport(true);
    setError(null);
    try {
      const testMemberId = searchParams?.get("test_member_id") || undefined;
      const data = await getUserReportData(
        testMemberId ? { test_member_id: testMemberId } : undefined
      );
      setReportData(data);
    } catch (err: unknown) {
      console.error("Error fetching user report data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取年度报告数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoadingReport(false);
    }
  }, [isAuthenticated, searchParams]);

  // Automatically fetch report data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchReportData();
    } else if (!isAuthenticated) {
      // Clear report data when user logs out
      setReportData(null);
      setError(null);
      setUserChoicesState({});
      setSummaryPosterState(null);
    }
  }, [isAuthenticated, isAuthLoading, fetchReportData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setUserChoice = useCallback((sceneName: string, choice: string) => {
    setUserChoicesState((prev) => {
      const updated = {
        ...prev,
        [sceneName]: choice,
      };
      console.log('Setting choice:', sceneName, '=', choice, 'Updated choices:', updated);
      return updated;
    });
  }, []);

  const getUserChoice = useCallback(
    (sceneName: string) => {
      return userChoices[sceneName];
    },
    [userChoices]
  );

  const setSummaryPoster = useCallback((poster: SummaryPosterData) => {
    setSummaryPosterState(poster);
  }, []);

  // Debug: Log userChoices whenever it changes
  useEffect(() => {
    console.log('userChoices updated:', userChoices);
  }, [userChoices]);

  return (
    <UserReportDataContext.Provider
      value={{
        reportData,
        isLoadingReport,
        error,
        fetchReportData,
        clearError,
        userChoices,
        setUserChoice,
        getUserChoice,
        summaryPoster,
        setSummaryPoster,
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

