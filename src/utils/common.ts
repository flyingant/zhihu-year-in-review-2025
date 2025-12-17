import { isZhihuApp } from "@/lib/zhihu-detection";

export const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "";

  const parts = dateStr.split("-");

  if (parts.length === 3) {
    return `${parts[1]}月 ${parts[2]}日`;
  }

  return dateStr;
};

export const formatFullDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "";

  const parts = dateStr.split("-");

  if (parts.length === 3) {
    return `${parts[0]}年${parts[1]}月${parts[2]}日`;
  }

  return dateStr;
};

export interface DateParts {
  year: string;
  month: string;
  day: string;
}
export const formatDateWithoutText = (
  dateStr: string | undefined | null
): DateParts => {
  if (!dateStr) return { year: "", month: "", day: "" };

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2],
    };
  }

  return { year: "", month: "", day: "" };
};

// truncate text to maxLength, add ellipsis if text is longer than maxLength
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 20
) => {
  if (!text) return "";
  const str = String(text);
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

interface PromiseObservable<T> extends Promise<T> {
  subscribe?: (callback: (result: T) => void) => void;
}
interface ZhihuHybridAction {
  dispatch(params: Record<string, unknown>): PromiseObservable<unknown>;
}

interface ZhihuHybridNewAPI {
  (action: string): ZhihuHybridAction;
}

/**
 * 保存图片到本地
 * 如果在知乎 App 内，使用 zhihuHybrid SDK 下载图片
 * 否则使用标准的 JavaScript 下载方法
 */
export const handleSaveImage = async (posterUrl) => {
  if (!posterUrl) {
    // showToast('没有可保存的图片', 'error');
    return;
  }

  // 检测是否在知乎 App 内
  if (isZhihuApp()) {
    try {
      // 在知乎 App 内，使用 Hybrid SDK 下载图片
      const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
        "base/downloadImage"
      );
      await hybridAction.dispatch({
        url: posterUrl,
      });

      // showToast('图片保存成功', 'success');
    } catch (error) {
      console.error("Failed to save image via zhihuHybrid:", error);
      // 如果 zhihuHybrid 失败，降级到标准下载方法
      await downloadImageStandard(posterUrl);
    }
  } else {
    // 不在知乎 App 内，使用标准下载方法
    await downloadImageStandard(posterUrl);
  }
};

/**
 * 标准的图片下载方法（用于非知乎 App 环境）
 * 使用 canvas 方法绕过 CORS 限制
 */
const downloadImageStandard = async (imageUrl: string) => {
  try {
    // 方法1: 尝试使用 canvas（需要服务器支持 CORS）
    const tryCanvasMethod = (): Promise<Blob> => {
      return new Promise<Blob>((resolve, reject) => {
        const img = document.createElement("img");
        img.crossOrigin = "anonymous";

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to convert canvas to blob"));
              }
            }, "image/png");
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error("Failed to load image with CORS"));
        img.src = imageUrl;
      });
    };

    // 方法2: 直接使用 fetch（如果 canvas 方法失败）
    const tryFetchMethod = async (): Promise<Blob> => {
      const response = await fetch(imageUrl, {
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      return await response.blob();
    };

    // 方法3: 使用代理或直接链接下载（最后的降级方案）
    const tryDirectDownload = () => {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `poster-${Date.now()}.png`;
      link.target = "_blank";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    let blob: Blob;

    try {
      // 首先尝试 canvas 方法
      blob = await tryCanvasMethod();
    } catch (canvasError) {
      console.warn("Canvas method failed, trying fetch:", canvasError);
      try {
        // 如果 canvas 失败，尝试 fetch
        blob = await tryFetchMethod();
      } catch (fetchError) {
        console.warn("Fetch method failed, using direct download:", fetchError);
        // 如果都失败，使用直接下载（可能在某些浏览器中不工作）
        tryDirectDownload();
        return;
      }
    }

    // 如果成功获取到 blob，创建下载链接
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `poster-${Date.now()}.png`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    // showToast("图片保存成功", "success");
  } catch (error) {
    console.error("Failed to download image:", error);
    // showToast("保存失败，请稍后重试", "error");
  }
};
