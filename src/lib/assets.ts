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
  // KV Section assets
  kv: {
    logo: {
      url: '/assets/zhihu_logo.png',
      width: 187,
      height: 36,
      alt: 'Zhihu Logo',
    },
    background: '/assets/bg_2025.png',
    subtitle: {
      url: '/assets/subtitle_text.png',
      width: 245,
      height: 107,
      alt: '到底什么是真的？',
    },
    tag: {
      url: '/assets/kv_tag.png',
      width: 350,
      height: 16,
      alt: 'Artificial or authentic',
    },
    liukanshan: {
      url: '/assets/kv_liukanshan.png',
      width: 68,
      height: 75,
      alt: '刘看山和文字',
    },
    intro: {
      url: '/assets/kv_intro.png',
      width: 167,
      height: 88,
      alt: '文字',
    },
    danmakus: [
      {
        url: '/assets/danmaku_1.png',
        width: 277,
        height: 22,
        alt: '弹幕',
      },
      {
        url: '/assets/danmaku_2.png',
        width: 114,
        height: 22,
        alt: '弹幕',
      },
      {
        url: '/assets/danmaku_3.png',
        width: 215,
        height: 22,
        alt: '弹幕',
      },
      {
        url: '/assets/danmaku_4.png',
        width: 250,
        height: 22,
        alt: '弹幕',
      },
      {
        url: '/assets/danmaku_5.png',
        width: 102,
        height: 22,
        alt: '弹幕',
      },
      {
        url: '/assets/danmaku_6.png',
        width: 100,
        height: 22,
        alt: '弹幕',
      },
    ],
  },
  
  // Folder Section assets
  folders: {
    folder1: {
      url: '/assets/folder_1.png',
      width: 375,
      height: 500,
      alt: '嘉宾1',
    },
    folder2: {
      url: '/assets/folder_2.png',
      width: 375,
      height: 500,
      alt: '嘉宾2',
    },
    folder3: {
      url: '/assets/folder_3.png',
      width: 375,
      height: 500,
      alt: '嘉宾3',
    },
    folder4: {
      url: '/assets/folder_4.png',
      width: 375,
      height: 500,
      alt: '嘉宾4',
    },
    folder5: {
      url: '/assets/folder_5.png',
      width: 375,
      height: 500,
      alt: '嘉宾5',
    },
    folder6: {
      url: '/assets/folder_6.png',
      width: 375,
      height: 500,
      alt: '嘉宾6',
    },
    footer: {
      url: '/assets/folder_footer.png',
      width: 343,
      height: 135,
      alt: '点击名字查看真实瞬间',
    },
    // Array format for easier iteration
    all: [
      {
        url: '/assets/folder_1.png',
        width: 375,
        height: 500,
        alt: '嘉宾1',
      },
      {
        url: '/assets/folder_2.png',
        width: 375,
        height: 500,
        alt: '嘉宾2',
      },
      {
        url: '/assets/folder_3.png',
        width: 375,
        height: 500,
        alt: '嘉宾3',
      },
      {
        url: '/assets/folder_4.png',
        width: 375,
        height: 500,
        alt: '嘉宾4',
      },
      {
        url: '/assets/folder_5.png',
        width: 375,
        height: 500,
        alt: '嘉宾5',
      },
      {
        url: '/assets/folder_6.png',
        width: 375,
        height: 500,
        alt: '嘉宾6',
      },
    ],
  },
  
  // New image assets
  newImages: {
    wuzida2025: {
      url: '/assets/2025qinzida@2x.png',
      width: 978,
      height: 302,
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
    zheXieZhenDeKeYi: {
      url: '/assets/zhexiezhendekeyi@2x.png',
      width: 924,
      height: 274,
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

