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
 * Prize asset metadata with positioning and target ID
 */
export type PrizeAssetMetadata = AssetMetadata & {
  targetId: number;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
};

/**
 * Asset metadata with optional jump_url
 */
export type AssetMetadataWithJumpUrl = AssetMetadata & {
  jump_url?: string;
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
    bgPhase2: AssetMetadata;
    danmakus: AssetMetadata[];
  };
  folders: {
    footer: AssetMetadata;
    all: AssetMetadataWithJumpUrl[];
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
  zheXieZhenDeKeYiImages: AssetMetadataWithJumpUrl[];
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
    selfAnswerExamples: AssetMetadataWithJumpUrl[];
  };
  tasks: {
    bg: AssetMetadata;
    prizeBg: AssetMetadata;
    prizes: PrizeAssetMetadata[];
    prizex: AssetMetadata;
  };
  zhihuSearch: {
    bg: AssetMetadata;
  };
  yearly: {
    videoBg: AssetMetadata;
    reportBg: AssetMetadata;
    liukanshanWaving: AssetMetadata;
    videoFrame: AssetMetadata;
    videoBlurImage: AssetMetadata;
    videoClearImage: AssetMetadata;
    reportBlurImage: AssetMetadata;
    reportClearImage: AssetMetadata;
    questionBg: AssetMetadata;
    questionBlurImage: AssetMetadata;
    questionClearImage: AssetMetadata;
  };
  vote: {
    science: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    fitness: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    movie: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    sports: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    edu: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    travel: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    home: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    tech: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
    game: {
      select: AssetMetadata;
      unselect: AssetMetadata;
    };
  };
  /**
   * 外部链接URL配置
   */
  urls: {
    /** 侧边栏刘看山发布链接 - 跳转到发布想法页面，包含活动话题和主会场链接 */
    sidebarLiuKanshanPublish: string;
    /** 活动规则链接 - 跳转到活动规则页面 */
    sidebarCampaignRules: string;
    /** 小电脑问题链接 - 跳转到"到底什么是真的？"问题页面 */
    miniComputerQuestion: string;
    /** 年度视频链接 - 跳转到年度视频活动页面 */
    yearlyVideo: string;
    /** 积分兑换基础URL - 用于构建积分兑换相关页面的完整URL */
    taskPointRedeemBase: string;
    /** 积分兑换历史记录URL后缀 - 与taskPointRedeemBase组合使用 */
    taskPointRedeemHistory: string;
    /** 积分明细URL后缀 - 与taskPointRedeemBase组合使用 */
    taskPointRedeemDetails: string;
    /** 登录页面基础URL - 跳转到知乎登录页面 */
    signinBase: string;
    /** 年度问题链接数组 - 跳转到年度问题页面 */
    yearlyQuestions: string[];
  };
  /**
   * 活动配置设置
   */
  campaign: {
    /**
     * 2025年度活动ID
     * 用于API调用，获取活动信息、兑换奖品等
     * 更新日期: 2025-12-01
     */
    activityId: number;
    /**
     * 任务ID白名单 - 决定页面上显示哪些任务
     * 数组中ID的顺序决定了页面上的显示顺序
     * 只有此列表中的任务ID会被显示，即使API返回了更多任务
     */
    showTaskIds: number[];
    /**
     * 用于特定完成操作的任务ID
     * 用于跟踪用户交互并完成相应任务
     */
    completeTaskIds: {
      /** 浏览"这些真的可以"模块的任务ID */
      BROWSE_ZHEXIEZHENDEKEYI: number;
      /** 浏览"分会场"模块的任务ID */
      BROWSE_FENHUICHANG: number;
      /** 浏览刘看山模块的任务ID */
      BROWSE_LKS_SECTION: number;
      /** 点击刘看山礼品按钮的任务ID */
      CLICK_LKS_GIFT: number;
      /** 点击刘看山礼品发布按钮的任务ID */
      CLICK_LKS_GIFT_PUBLISH: number;
    };
    /**
     * 兑换记录按钮覆盖层的位置设置
     * 用于在奖品背景图上定位可点击区域
     */
    recordBtnPosition: {
      top: string;
      right: string;
      width: string;
      height: string;
    };
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

