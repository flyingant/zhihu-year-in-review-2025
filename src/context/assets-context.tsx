'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

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
    bgBottom2: AssetMetadata;
  };
  kv: {
    logo: AssetMetadata;
    logoWhite: AssetMetadata;
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
  zheXieZhenDeKeYiImages2: {
    title: AssetMetadata;
    zhenkeyiClearImage: AssetMetadata;
    zhenkeyiBlurImage: AssetMetadata;
    items: AssetMetadataWithJumpUrl[];
    liukanshanWaving: AssetMetadata;
    liukanshanLookup: AssetMetadata;
  };
  newImages: {
    wuzida2025: AssetMetadata;
    wuzida2025Banner: AssetMetadata;
    liukanshanBianLiDian: AssetMetadata;
    zaiZhiHuLianJieZhenShi: AssetMetadata;
    qiangXianYuGao: AssetMetadata;
    qiangXianYuGaoBanner: AssetMetadata;
    zheXieZhenDeKeYi: AssetMetadata;
    zheXieZhenDeKeYi2: AssetMetadata;
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
    qingZiDa: AssetMetadataWithJumpUrl[];
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
  h5Logo: {
    bg: AssetMetadata;
  };
  yearly: {
    videoBg: AssetMetadata;
    reportBg: AssetMetadata;
    liukanshanWaving: AssetMetadata;
    liukanshanLookup: AssetMetadata;
    videoFrame: AssetMetadata;
    videoBlurImage: AssetMetadata;
    videoClearImage: AssetMetadata;
    reportBlurImage: AssetMetadata;
    reportClearImage: AssetMetadata;
    questionBg: AssetMetadata;
    questionBlurImage: AssetMetadata;
    questionClearImage: AssetMetadata;
  };
  fourGrid: {
    blur: AssetMetadata;
    bg: AssetMetadata;
    save: AssetMetadata;
    unauth: AssetMetadata;
    preview: {
      annual_video: AssetMetadata;
      annual_report: AssetMetadata;
      annual_question: AssetMetadata;
      really_can: AssetMetadata;
    };
    download: {
      annual_video: AssetMetadata;
      annual_report: AssetMetadata;
      annual_question: AssetMetadata;
      really_can: AssetMetadata;
    };
  };
  vote: {
    title: AssetMetadata;
    listBg: AssetMetadata;
    btnBg: AssetMetadata;
    cancelBtn: AssetMetadata;
    panelBg: AssetMetadata;
    save: AssetMetadata;
    saveBottom: AssetMetadata;
    science: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    fitness: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    movie: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    sports: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    edu: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    travel: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    home: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    tech: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
    game: {
      select: AssetMetadata;
      unselect: AssetMetadata;
      categorySelect: AssetMetadata;
      categoryUnselect: AssetMetadata;
    };
  };
  nianZhongXiaoWen: {
    bg: AssetMetadata;
  };
  realMoment: {
    bg: AssetMetadata;
    content: [];
  };
  report: {
    intro: {
      step1: AssetMetadata;
      step2: AssetMetadata;
      step3: AssetMetadata;
      title: AssetMetadata;
      button: AssetMetadata;
      arrowDown: AssetMetadata;
    };
    bg: {
      blue0_1: AssetMetadata;
      blue0_2: AssetMetadata;
      blue0_3: AssetMetadata;
      blue0_4: AssetMetadata;
      blue1: AssetMetadata;
      blue2: AssetMetadata;
      blue10: AssetMetadata;
      blue15: AssetMetadata;
      blue16: AssetMetadata;
      green0: AssetMetadata;
      green1: AssetMetadata;
      mix0_1: AssetMetadata;
      mix0_2: AssetMetadata;
      mix0_3: AssetMetadata;
      mix0_4: AssetMetadata;
      mix0_5: AssetMetadata;
      mixintro_1: AssetMetadata;
      mixintro_2: AssetMetadata;
      mix1: AssetMetadata;
      mix2: AssetMetadata;
      mix3: AssetMetadata;
      mix4: AssetMetadata;
      mix5: AssetMetadata;
      mix6: AssetMetadata;
      mix7: AssetMetadata;
      mix8: AssetMetadata;
      mix9: AssetMetadata;
      mix14: AssetMetadata;
      mix15: AssetMetadata;
      mix15_1: AssetMetadata;
      mix15_2: AssetMetadata;
      mix16_1: AssetMetadata;
      mix16_2: AssetMetadata;
      mix17: AssetMetadata;
      mix19: AssetMetadata;
      mix20: AssetMetadata;
      mix21_1: AssetMetadata;
      mix21_2: AssetMetadata;
      mix21_3: AssetMetadata;
      mix21_4: AssetMetadata;
      mix22_1: AssetMetadata;
      mix22_2: AssetMetadata;
      mix22_3: AssetMetadata;
      mix22_4: AssetMetadata;
      mix22_5: AssetMetadata;
    };
    p1: {
      bg: AssetMetadata;
      middle: AssetMetadata;
      top: AssetMetadata;
      liukanshanReading: AssetMetadata;
      optionA: AssetMetadata;
      optionB: AssetMetadata;
    };
    p2: {
      liukanshan: AssetMetadata;
      blueBall: AssetMetadata;
      yellowBall: AssetMetadata;
    };
    p3: {
      jiangtai: AssetMetadata;
    };
    p4: {
      caidai: AssetMetadata;
    };
    p5: {
      liukanshan: AssetMetadata;
      yellowMirror: AssetMetadata;
      hi: AssetMetadata;
      '3dHi': AssetMetadata;
      gif: AssetMetadata;
    };
    p6: {
      liukanshan: AssetMetadata;
      gif: AssetMetadata;
      books: AssetMetadata;
    };
    p7: {
      liukanshan: AssetMetadata;
      blueBubble: AssetMetadata;
      redBubble: AssetMetadata;
      yellowBubble: AssetMetadata;
      gif: AssetMetadata;
    };
    p8: {
      liukanshan: AssetMetadata;
      sparkle: AssetMetadata;
      ship: AssetMetadata;
      gif: AssetMetadata;
    };
    p9: {
      bg: AssetMetadata;
      middle: AssetMetadata;
      top: AssetMetadata;
      liukanshan: AssetMetadata;
      optionA: AssetMetadata;
      optionB: AssetMetadata;
    };
    p10: {
      group1: AssetMetadata;
      group2: AssetMetadata;
      group3: AssetMetadata;
      group4: AssetMetadata;
      words: AssetMetadata;
    };
    p11: {
      folder: AssetMetadata;
      words: AssetMetadata;
      liukanshan: AssetMetadata;
      table: AssetMetadata;
      green: AssetMetadata;
      yellow: AssetMetadata;
      crown: AssetMetadata;
    };
    p12: {
      liukanshan: AssetMetadata;
      sun: AssetMetadata;
      moon: AssetMetadata;
      bar: AssetMetadata;
      clock: AssetMetadata;
      gif: AssetMetadata;
    };
    p13: {
      liukanshan: AssetMetadata;
      gif: AssetMetadata;
    };
    p15: {
      ladder: AssetMetadata;
      year: AssetMetadata;
      gif1: AssetMetadata;
      gif2: AssetMetadata;
      gif3: AssetMetadata;
    };
    p14: {
      bg: AssetMetadata;
      top: AssetMetadata;
      middle: AssetMetadata;
      optionA: AssetMetadata;
      optionB: AssetMetadata;
    };
    p16: {
      thumbUp: AssetMetadata;
      subscribe: AssetMetadata;
      subscribed: AssetMetadata;
      gif: AssetMetadata;
    };
    p17: {
      city: AssetMetadata;
      pointer1: AssetMetadata;
      pointer2: AssetMetadata;
      pointer3: AssetMetadata;
      pointer4: AssetMetadata;
      pointer5: AssetMetadata;
    };
    p18: {
      main: AssetMetadata;
      gif: AssetMetadata;
    };
    p19: {
      blue: AssetMetadata;
      pink: AssetMetadata;
      tiffany: AssetMetadata;
      yellow: AssetMetadata;
      liukanshan: AssetMetadata;
      gif: AssetMetadata;
    };
    p20: {
      main: AssetMetadata;
      gif: AssetMetadata;
    };
    p21: {
      bg: AssetMetadata;
      middle: AssetMetadata;
      top: AssetMetadata;
      liukanshan: AssetMetadata;
      optionA: AssetMetadata;
      optionB: AssetMetadata;
    };
    p22: {
      liukanshan: AssetMetadata;
      front: AssetMetadata;
      back: AssetMetadata;
      message: AssetMetadata;
      join: AssetMetadata;
      joined: AssetMetadata;
      gif: AssetMetadata;
    };
    p23: {
      review: AssetMetadata;
      gif: AssetMetadata;
    };
    p24: {
      liukanshan: AssetMetadata;
      film: AssetMetadata;
      gif: AssetMetadata;
    };
    p25: {
      liukanshan: AssetMetadata;
      top: AssetMetadata;
      left: AssetMetadata;
      middle: AssetMetadata;
      right: AssetMetadata;
      gif: AssetMetadata;
    };
    p26: {
      liukanshan: AssetMetadata;
      pinkPixel: AssetMetadata;
      rainbow: AssetMetadata;
      redPixel1: AssetMetadata;
      redPixel2: AssetMetadata;
      gif: AssetMetadata;
    };
    loading: AssetMetadata;
    loadingBar: AssetMetadata;
    index: {
      topLeft: AssetMetadata;
      topRight: AssetMetadata;
      bottomLeft: AssetMetadata;
      bottomRight: AssetMetadata;
      liukanshan: AssetMetadata;
      bgTopLeft: AssetMetadata;
      bgTopRight: AssetMetadata;
      bgBottomLeft: AssetMetadata;
      bgBottomRight: AssetMetadata;
      gif: AssetMetadata;
      gifReverse: AssetMetadata;
    };
    top2025: AssetMetadata;
    top2026: AssetMetadata;
    topSpiningInfinit: AssetMetadata;
    topSpiningStop: AssetMetadata;
    audio: {
      iconDisable: AssetMetadata;
      iconPlaying: AssetMetadata;
      bgAudio: AssetMetadata;
      hitCoin: AssetMetadata;
      flipBook: AssetMetadata;
      jumpUp: AssetMetadata;
      noise: AssetMetadata;
    };

    p28: {
      bg: AssetMetadata;
      bg1: AssetMetadata;
      bg2: AssetMetadata;
      bg3: AssetMetadata;
      bg4: AssetMetadata;
      bg5: AssetMetadata;
      bg6: AssetMetadata;
      bg7: AssetMetadata;
      bg8: AssetMetadata;
      bg9: AssetMetadata;
      bg10: AssetMetadata;
      titleOther: AssetMetadata;
      titleSelf: AssetMetadata;
      titleTransparent: AssetMetadata;
      flags: {
        cure: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        get: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        action: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        release: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        live: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        love: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        good: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        ai: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        clam: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        growth: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        change: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        zhileng: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
      };
      banners: {
        cure: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        get: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        action: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        release: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        live: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        love: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        good: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        ai: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        clam: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        growth: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        change: {
          active: AssetMetadata;
          grey: AssetMetadata;
          selfActive: AssetMetadata;
        };
        zhileng: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
        empty: {
          active: AssetMetadata;
          grey: AssetMetadata;
        };
      };
      flagEmpty: AssetMetadata;
    };
    p29: {
      iconFriend: AssetMetadata;
      shareHeadImg: AssetMetadata;
    };
    guess: {
      taOption: AssetMetadata;
      yourOption: AssetMetadata;
      yourOptionCorrect: AssetMetadata;
      chooseSame: AssetMetadata;
      chooseDifferent: AssetMetadata;
      go: AssetMetadata;
      goAgain: AssetMetadata;
    };
  };
  /**
   * 外部链接URL配置
   */
  urls: {
    /** 侧边栏刘看山发布链接 - 跳转到发布想法页面，包含活动话题和主会场链接 */
    sidebarLiuKanshanInPCPublish: string;
    /** 侧边栏刘看山发布链接 - 跳转到发布想法页面，包含活动话题和主会场链接 */
    sidebarLiuKanshanInAppPublish: string;
    /** 活动规则链接 - 跳转到活动规则页面 */
    sidebarCampaignRules: string;
    /** 小电脑问题链接 - 跳转到"到底什么是真的？"问题页面 */
    miniComputerQuestion: string;
    /** 小电脑问题App内跳转URL - 当用户不在App内时，点击输入区域跳转到此URL */
    miniComputerQuestionInAppRedirectionURL: string;
    /** 积分兑换基础URL - 用于构建积分兑换相关页面的完整URL */
    taskPointRedeemBase: string;
    /** 积分兑换历史记录URL后缀 - 与taskPointRedeemBase组合使用 */
    taskPointRedeemHistory: string;
    /** 积分明细URL后缀 - 与taskPointRedeemBase组合使用 */
    taskPointRedeemDetails: string;
    /** 登录页面基础URL - 跳转到知乎登录页面 */
    signinBase: string;
    /** 刘看山积分奖励App内跳转URL - 当用户不在App内时，点击奖励区域跳转到此URL */
    liukanshanPointRewardInAppRedirectionURL: string;
    /** 刘看山积分任务App内跳转URL - 当用户不在App内时，点击任务区域跳转到此URL */
    liukanshanPointTaskInAppRedirectionURL: string;
    /** App内跳转URL - 当用户不在App内且为移动端时，显示底部按钮跳转到此URL */
    inAppRedirectionURL: string;
    /** 年度问题链接数组 - 跳转到年度问题页面 */
    yearlyQuestions: string[];
    /** 年度视频ID - 用于获取年度视频详情 */
    yearlyVideoID: string;
    /** 年度视频讨论跳转URL - 跳转到年度视频讨论页面 */
    yearlyVideoDiscussRedirectionURL: string;
    /** 年度报告跳转URL - 跳转到年度报告页面 */
    yearlyReportRedirectionURL: string;
    /** 年度报告讨论跳转URL - 跳转到年度报告讨论页面 */
    yearlyReportDiscussRedirectionURL: string;
    /** 年终小问视频ID - 用于获取年终小问视频详情 */
    nianZhongXiaoWenVideoID: string;
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
      /** 浏览2025年度视频的任务ID */
      BROWSE_2025_YEARLY_VIDEO: number;
      /** 浏览2025年度报告的任务ID */
      BROWSE_2025_YEARLY_REPORT: number;
      /** 浏览2025年度十个问题的任务ID */
      BROWSE_2025_YEARLY_TEN_QUESTIONS: number;
      /** 浏览我的年度十问的任务ID */
      BROWSE_2025_MY_TEN_QUESTIONS: number;
      /** 收集四宫格元素的任务ID */
      COLLECT_FOUR_GRID_ELEMENT: number;
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

// Build version for cache busting - generated once at module load time
// This ensures all assets in the same build have the same version
const BUILD_VERSION =
  process.env.NEXT_PUBLIC_BUILD_VERSION || Date.now().toString();

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetsData | null>(null);
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

      // Fetch assets.json: Always use BASE_PATH (never CDN) with timestamp for cache busting
      const baseAssetsPath = BASE_PATH
        ? `${BASE_PATH}/assets.json`
        : '/assets.json';
      const separator = baseAssetsPath.includes('?') ? '&' : '?';
      const assetsJsonPath = `${baseAssetsPath}${separator}v=${BUILD_VERSION}`;
      const response = await fetch(assetsJsonPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch assets: ${response.statusText}`);
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
        const IGNORE_BASE_URL =
          process.env.NEXT_PUBLIC_IGNORE_BASE_URL === 'true';
        if (CDN_BASE_URL) {
          const cdnBase = CDN_BASE_URL.endsWith('/')
            ? CDN_BASE_URL.slice(0, -1)
            : CDN_BASE_URL;
          if (IGNORE_BASE_URL) {
            // If IGNORE_BASE_URL is true, use only CDN_BASE_URL without BASE_PATH
            baseUrl = cdnBase;
          } else {
            // Combine CDN_BASE_URL + BASE_PATH
            if (BASE_PATH) {
              const basePath = BASE_PATH.startsWith('/')
                ? BASE_PATH
                : `/${BASE_PATH}`;
              baseUrl = `${cdnBase}${basePath}`;
            } else {
              baseUrl = cdnBase;
            }
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
            const cleanBaseUrl = baseUrl.endsWith('/')
              ? baseUrl.slice(0, -1)
              : baseUrl;
            finalUrl = `${cleanBaseUrl}/${cleanPath}`;
          }
        } else if (baseUrl) {
          // If URL doesn't start with '/', still prepend base URL if available
          const cleanBaseUrl = baseUrl.endsWith('/')
            ? baseUrl.slice(0, -1)
            : baseUrl;
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
            Object.entries(objRecord).map(([key, value]) => [
              key,
              transformAssets(value),
            ])
          );
        }
        return obj;
      };

      const transformedAssets = transformAssets(assetsData) as AssetsData;
      setAssets(transformedAssets);
    } catch (err: unknown) {
      console.error('Error fetching assets:', err);
      const errorMessage =
        err instanceof Error ? err.message : '获取资源数据失败，请稍后重试';
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
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
}
