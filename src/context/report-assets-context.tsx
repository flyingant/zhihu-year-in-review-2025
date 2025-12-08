"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/**
 * Asset metadata type
 */
export type AssetMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Report assets data structure matching the JSON schema
 */
export interface ReportAssetsData {
  bg: AssetMetadata;
  bgBottom: AssetMetadata;
}

interface ReportAssetsContextType {
  assets: ReportAssetsData | null;
  isLoading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  clearError: () => void;
}

const ReportAssetsContext = createContext<ReportAssetsContextType | undefined>(undefined);

// Build version for cache busting - generated once at module load time
// This ensures all assets in the same build have the same version
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION || Date.now().toString();

export function ReportAssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<ReportAssetsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get basePath from NEXT_PUBLIC_BASE_URL (same as next.config.mjs)
      // Falls back to production default '/zhihu2025' if not set
      const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';
      const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

      // Fetch report_assets.json: Always use BASE_PATH (never CDN) with timestamp for cache busting
      const baseAssetsPath = BASE_PATH ? `${BASE_PATH}/report_assets.json` : '/report_assets.json';
      const separator = baseAssetsPath.includes('?') ? '&' : '?';
      const assetsJsonPath = `${baseAssetsPath}${separator}v=${BUILD_VERSION}`;
      const response = await fetch(assetsJsonPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch report assets: ${response.statusText}`);
      }

      const assetsData = await response.json();

      // Transform asset URLs (images, videos, etc.) to include CDN base path + BASE_PATH
      const transformAssetUrl = (url: string): string => {
        if (!url) return url;

        // If URL is already absolute (starts with http:// or https://), return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        // For relative URLs, combine CDN_BASE_URL + BASE_PATH if CDN is configured
        // Otherwise, use BASE_PATH only
        let baseUrl = '';
        if (CDN_BASE_URL) {
          // Combine CDN_BASE_URL + BASE_PATH
          const cdnBase = CDN_BASE_URL.endsWith('/') ? CDN_BASE_URL.slice(0, -1) : CDN_BASE_URL;
          if (BASE_PATH) {
            const basePath = BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`;
            baseUrl = `${cdnBase}${basePath}`;
          } else {
            baseUrl = cdnBase;
          }
        } else {
          baseUrl = BASE_PATH;
        }

        // Build the final URL
        let finalUrl = url;

        // If URL starts with '/', prepend the base URL
        if (url.startsWith('/')) {
          if (baseUrl) {
            const cleanPath = url.slice(1); // Remove leading slash
            // Ensure baseUrl doesn't end with / and cleanPath doesn't start with /
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            finalUrl = `${cleanBaseUrl}/${cleanPath}`;
          }
        } else if (baseUrl) {
          // If URL doesn't start with '/', still prepend base URL if available
          const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
          finalUrl = `${cleanBaseUrl}/${url}`;
        }

        // Append version query parameter for cache busting
        const separator = finalUrl.includes('?') ? '&' : '?';
        return `${finalUrl}${separator}v=${BUILD_VERSION}`;
      };

      // Recursively transform all URLs in the assets object
      const transformAssets = (obj: unknown): unknown => {
        if (Array.isArray(obj)) {
          return obj.map(transformAssets);
        } else if (obj && typeof obj === 'object' && obj !== null) {
          const objRecord = obj as Record<string, unknown>;
          if ('url' in objRecord && typeof objRecord.url === 'string') {
            return {
              ...objRecord,
              url: transformAssetUrl(objRecord.url),
            };
          }
          return Object.fromEntries(
            Object.entries(objRecord).map(([key, value]) => [key, transformAssets(value)])
          );
        }
        return obj;
      };

      const transformedAssets = transformAssets(assetsData) as ReportAssetsData;
      setAssets(transformedAssets);
    } catch (err: unknown) {
      console.error("Error fetching report assets:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取报告资源数据失败，请稍后重试";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch assets on mount
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ReportAssetsContext.Provider
      value={{
        assets,
        isLoading,
        error,
        fetchAssets,
        clearError,
      }}
    >
      {children}
    </ReportAssetsContext.Provider>
  );
}

export function useReportAssets() {
  const context = useContext(ReportAssetsContext);
  if (context === undefined) {
    throw new Error("useReportAssets must be used within a ReportAssetsProvider");
  }
  return context;
}

