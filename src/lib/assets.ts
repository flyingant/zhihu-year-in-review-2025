/**
 * Centralized Asset Manager
 * 
 * Manages all asset paths in one place for easy CDN migration.
 * To use CDN, set NEXT_PUBLIC_CDN_BASE_URL environment variable.
 * 
 * Example: NEXT_PUBLIC_CDN_BASE_URL=https://cdn.example.com
 */

// CDN base URL from environment variable (empty string = local assets)
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || '';

/**
 * Get the full URL for an asset path
 * @param path - Relative asset path (e.g., '/assets/image.png')
 * @returns Full URL (CDN + path or just path if no CDN configured)
 */
export function getAssetUrl(path: string): string {
  if (!path) return path;

  // If CDN is configured and path starts with '/', prepend CDN base URL
  if (CDN_BASE_URL && path.startsWith('/')) {
    // Remove leading slash from path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${CDN_BASE_URL}/${cleanPath}`;
  }

  return path;
}

/**
 * Asset paths registry
 * All asset paths are defined here for centralized management
 */
export const assets = {
  home: {
    bg: {
      url: '/assets/home_bg@3x.png',
      width: 1125,
      height: 6938,
      alt: 'Home Background',
    }
  },
  // KV Section assets
  kv: {
    logo: {
      url: '/assets/zhihu_logo.png',
      width: 187,
      height: 36,
      alt: 'Zhihu Logo',
    },
    bg: {
      url: '/assets/kv_danmakus_bg@3x.png',
      width: 1041,
      height: 870,
      alt: '到底什么是真的？',
    },
    danmakus: [
      {
        url: '/assets/kv_danmaku_1@3x.png',
        width: 830,
        height: 64,
        alt: '弹幕',
      },
      {
        url: '/assets/kv_danmaku_2@3x.png',
        width: 365,
        height: 64,
        alt: '弹幕',
      },
      {
        url: '/assets/kv_danmaku_3@3x.png',
        width: 730,
        height: 64,
        alt: '弹幕',
      },
      {
        url: '/assets/kv_danmaku_4@3x.png',
        width: 744,
        height: 64,
        alt: '弹幕',
      },
      {
        url: '/assets/kv_danmaku_5@3x.png',
        width: 304,
        height: 64,
        alt: '弹幕',
      },
      {
        url: '/assets/kv_danmaku_6@3x.png',
        width: 609,
        height: 64,
        alt: '弹幕',
      },
    ],
  },

  // Folder Section assets
  folders: {
    folder1: {
      url: '/assets/folder_word_1@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾1',
    },
    folder2: {
      url: '/assets/folder_word_2@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾2',
    },
    folder3: {
      url: '/assets/folder_word_3@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾3',
    },
    folder4: {
      url: '/assets/folder_word_4@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾4',
    },
    folder5: {
      url: '/assets/folder_word_5@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾5',
    },
    folder6: {
      url: '/assets/folder_word_6@3x.png',
      width: 1030,
      height: 500,
      alt: '嘉宾6',
    },
    footer: {
      url: '/assets/folder_footer@3x.png',
      width: 1017,
      height: 428,
      alt: '点击名字查看真实瞬间',
    },
    // Array format for easier iteration
    all: [
      {
        url: '/assets/folder_word_1@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾1',
      },
      {
        url: '/assets/folder_word_2@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾2',
      },
      {
        url: '/assets/folder_word_3@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾3',
      },
      {
        url: '/assets/folder_word_4@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾4',
      },
      {
        url: '/assets/folder_word_5@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾5',
      },
      {
        url: '/assets/folder_word_6@3x.png',
        width: 1030,
        height: 500,
        alt: '嘉宾6',
      },
    ],
  },

  // Game Section assets
  games: {
    title: {
      url: '/assets/game_title@3x.png',
      width: 582,
      height: 291,
      alt: 'Game Console title',
    },
    consoleBg: {
      url: '/assets/game_console_bg@3x.png',
      width: 1029,
      height: 662,
      alt: 'Game Console Background',
    },
    liukanshan: {
      url: '/assets/game_liukanshan@3x.png',
      width: 222,
      height: 312,
      alt: 'Game LiuKanShan',
    },
    fail: {
      url: '/assets/game_fail@3x.png',
      width: 657,
      height: 894,
      alt: 'Game Fail',
    },
    success: {
      url: '/assets/game_success@3x.png',
      width: 981,
      height: 1506,
      alt: 'Game Success',
    },
    bottomBanner: {
      url: '/assets/game_bottom_banner@3x.png',
      width: 1000,
      height: 150,
      alt: 'Game Bottom Banner',
    },
  },

  // New image assets
  newImages: {
    wuzida2025: {
      url: '/assets/2025qinzida@2x.png',
      width: 978,
      height: 302,
      alt: '2025亲自答',
    },
    wuzida2025Banner: {
      url: '/assets/2025qinzida_banner@3x.png',
      width: 1030,
      height: 408,
      alt: '2025亲自答',
    },
    liukanshanBianLiDian: {
      url: '/assets/liukanshanzhenshibianlidian@2x.png',
      width: 629,
      height: 282,
      alt: '刘看山真实便利店',
    },
    zaiZhiHuLianJieZhenShi: {
      url: '/assets/zaizhihulianjiegengduodezhenshi@2x.png',
      width: 598,
      height: 240,
      alt: '在知乎链接更多的真实',
    },
    qiangXianYuGao: {
      url: '/assets/qiangxianyugao@2x.png',
      width: 788,
      height: 257,
      alt: '抢先预告',
    },
    qiangXianYuGaoBanner: {
      url: '/assets/qiangxianyugao_banner@3x.png',
      width: 1030,
      height: 408,
      alt: '抢先预告',
    },
    zheXieZhenDeKeYi: {
      url: '/assets/zhexiezhendekeyi@2x.png',
      width: 924,
      height: 274,
      alt: '这些真的可以',
    },
    zheXieZhenDeKeYiBanner: {
      url: '/assets/zhexiezhendekeyi_banner@3x.png',
      width: 1030,
      height: 408,
      alt: '这些真的可以',
    },

  },
} as const;

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
 * Helper function to get asset URL with CDN support
 * @param assetPath - Asset path from assets object (string or AssetMetadata object)
 * @returns Full URL with CDN prefix if configured, or the AssetMetadata object with processed URL
 */
export function asset(assetPath: string | AssetMetadata): string | AssetMetadata {
  if (typeof assetPath === 'string') {
    return getAssetUrl(assetPath);
  }
  // If it's an object, process the URL but keep other properties
  return {
    ...assetPath,
    url: getAssetUrl(assetPath.url),
  };
}

