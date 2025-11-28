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
 * Assets data structure matching the JSON schema
 */
export interface AssetsData {
  home: {
    bg: AssetMetadata;
    bgBottom: AssetMetadata;
  };
  kv: {
    logo: AssetMetadata;
    bg: AssetMetadata;
    danmakus: AssetMetadata[];
  };
  folders: {
    folder1: AssetMetadata;
    folder2: AssetMetadata;
    folder3: AssetMetadata;
    folder4: AssetMetadata;
    folder5: AssetMetadata;
    folder6: AssetMetadata;
    footer: AssetMetadata;
    all: AssetMetadata[];
  };
  games: {
    title: AssetMetadata;
    consoleBg: AssetMetadata;
    liukanshan: AssetMetadata;
    fail: AssetMetadata;
    success: AssetMetadata;
    bottomBanner: AssetMetadata;
    saveImage: AssetMetadata;
    syncIdeas: AssetMetadata;
  };
  zaiZhiHuLianJieZhenShiUrls: AssetMetadata[];
  newImages: {
    wuzida2025: AssetMetadata;
    wuzida2025Banner: AssetMetadata;
    liukanshanBianLiDian: AssetMetadata;
    zaiZhiHuLianJieZhenShi: AssetMetadata;
    qiangXianYuGao: AssetMetadata;
    qiangXianYuGaoBanner: AssetMetadata;
    zheXieZhenDeKeYi: AssetMetadata;
    zheXieZhenDeKeYiBanner: AssetMetadata;
    zhenShiShunJian: AssetMetadata;
    sidebarCampaignRules: AssetMetadata;
    sidebarLiuKanshan: AssetMetadata;
    sidebarLiuKanshanDialog: AssetMetadata;
    sidebarLiuKanshanCancel: AssetMetadata;
    sidebarLiuKanshanPublish: AssetMetadata;
    sidebarLiuKanshanPublishPc: AssetMetadata;
    sidebarLiuKanshanQrcode: AssetMetadata;
    sidebarLiuKanshanQrcodeTips: AssetMetadata;
    sidebarLiuKanshanDialogSoldOut: AssetMetadata;
    sidebarLiuKanshanTmr: AssetMetadata;
  };
  tasks: {
    bg: AssetMetadata;
    prizeBg: AssetMetadata;
    prizes: AssetMetadata[];
    prizex: AssetMetadata;
  };
  zhihuSearch: {
    bg: AssetMetadata;
  };
}

// Component expiration dates (in milliseconds since epoch)
export const componentExpiration = {
  sidebarLiuKanshan: new Date('2025-12-25T00:00:00').getTime(), // 2025.12.25 00:00
};

interface AssetsContextType {
  assets: AssetsData | null;
  isLoading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  clearError: () => void;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get basePath - could be from NEXT_PUBLIC_CDN_BASE_URL or NEXT_PUBLIC_BASE_PATH
      const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || process.env.NEXT_PUBLIC_CDN_BASE_URL || '';
      const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

      // Construct the assets.json path with basePath
      const assetsJsonPath = BASE_PATH ? `${BASE_PATH}/assets.json` : '/assets.json';
      const response = await fetch(assetsJsonPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch assets: ${response.statusText}`);
      }

      const assetsData = await response.json();

      // Transform asset URLs to include basePath and/or CDN
      const transformAssetUrl = (url: string): string => {
        if (!url) return url;

        // If URL is already absolute (starts with http:// or https://), return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        // If URL starts with '/', we need to prepend basePath
        if (url.startsWith('/')) {
          // If CDN_BASE_URL is set and it's different from BASE_PATH, use CDN
          // Otherwise, use BASE_PATH for the basePath
          const baseUrl = CDN_BASE_URL && CDN_BASE_URL !== BASE_PATH ? CDN_BASE_URL : BASE_PATH;

          if (baseUrl) {
            const cleanPath = url.slice(1); // Remove leading slash
            return `${baseUrl}/${cleanPath}`;
          }
        }

        return url;
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

      const transformedAssets = transformAssets(assetsData) as AssetsData;
      setAssets(transformedAssets);
    } catch (err: unknown) {
      console.error("Error fetching assets:", err);
      const errorMessage =
        err instanceof Error ? err.message : "获取资源数据失败，请稍后重试";
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
    <AssetsContext.Provider
      value={{
        assets,
        isLoading,
        error,
        fetchAssets,
        clearError,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetsProvider");
  }
  return context;
}

