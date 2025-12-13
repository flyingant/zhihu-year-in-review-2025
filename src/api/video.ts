// src/api/video.ts
import { videoRequest } from '../lib/request';

// Video detail response interface
// Based on actual Zhihu video API response structure
export interface VideoQuality {
  play_url: string;
  bitrate?: number;
  duration?: number;
  format?: string;
  fps?: number;
  size?: number;
  height?: number;
  width?: number;
  channels?: number;
  sample_rate?: number;
  url?: string;
}

export interface VideoDetailResponse {
  id?: string;
  video_id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  // Video object contains playlist with quality levels
  video?: {
    video_id?: string;
    width?: number;
    height?: number;
    duration?: number;
    thumbnail?: string;
    playlist?: {
      fhd?: VideoQuality;
      hd?: VideoQuality;
      sd?: VideoQuality;
      ld?: VideoQuality;
    };
    playlist_v2?: {
      fhd?: VideoQuality;
      hd?: VideoQuality;
      sd?: VideoQuality;
    };
    status?: string;
    [key: string]: unknown;
  };
  // Legacy fields for backward compatibility
  video_url?: string;
  play_url?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * Extract video play URL from API response
 * Handles actual Zhihu video API response structure
 */
export function extractVideoPlayUrl(details: VideoDetailResponse): string | null {
  // Try video.playlist structure (actual API structure)
  if (details.video?.playlist?.hd?.play_url) return details.video.playlist.hd.play_url;
  if (details.video?.playlist?.fhd?.play_url) return details.video.playlist.fhd.play_url;
  if (details.video?.playlist?.sd?.play_url) return details.video.playlist.sd.play_url;
  if (details.video?.playlist?.ld?.play_url) return details.video.playlist.ld.play_url;
  
  // Try video.playlist_v2 structure
  if (details.video?.playlist_v2?.hd?.play_url) return details.video.playlist_v2.hd.play_url;
  if (details.video?.playlist_v2?.fhd?.play_url) return details.video.playlist_v2.fhd.play_url;
  if (details.video?.playlist_v2?.sd?.play_url) return details.video.playlist_v2.sd.play_url;
  
  // Legacy fields for backward compatibility
  if (details.play_url) return details.play_url;
  if (details.video_url) return details.video_url;
  if (details.url && typeof details.url === 'string') return details.url;
  
  return null;
}

/**
 * Extract video URLs for different qualities (HD/SD)
 * Returns an object with hd and sd play URLs if available
 * Maps fhd -> hd for Griffith player compatibility
 */
export function extractVideoQualityUrls(details: VideoDetailResponse): {
  hd?: string;
  sd?: string;
} {
  const result: { hd?: string; sd?: string } = {};
  
  // Try video.playlist structure (actual API structure)
  // Map fhd to hd for Griffith player (Griffith uses hd/sd, not fhd)
  if (details.video?.playlist?.fhd?.play_url) {
    result.hd = details.video.playlist.fhd.play_url;
  } else if (details.video?.playlist?.hd?.play_url) {
    result.hd = details.video.playlist.hd.play_url;
  }
  
  if (details.video?.playlist?.sd?.play_url) {
    result.sd = details.video.playlist.sd.play_url;
  } else if (details.video?.playlist?.ld?.play_url) {
    result.sd = details.video.playlist.ld.play_url;
  }
  
  // Try video.playlist_v2 structure
  if (!result.hd && details.video?.playlist_v2?.fhd?.play_url) {
    result.hd = details.video.playlist_v2.fhd.play_url;
  } else if (!result.hd && details.video?.playlist_v2?.hd?.play_url) {
    result.hd = details.video.playlist_v2.hd.play_url;
  }
  
  if (!result.sd && details.video?.playlist_v2?.sd?.play_url) {
    result.sd = details.video.playlist_v2.sd.play_url;
  }
  
  // If no quality-specific URLs, use the general play URL for both
  const generalUrl = extractVideoPlayUrl(details);
  if (generalUrl) {
    if (!result.hd) result.hd = generalUrl;
    if (!result.sd) result.sd = generalUrl;
  }
  
  return result;
}

/**
 * Fetch video details from Zhihu API
 * In development mode, returns example response from videoExample.json
 * In production, makes actual API call
 * @param videoId - The video ID (e.g., '1855624605156438016')
 * @returns Promise with video details
 */
export const getVideoDetails = async (videoId: string): Promise<VideoDetailResponse> => {
  // Make actual API call in production
  return videoRequest<VideoDetailResponse>({
    url: `/${videoId}`,
    method: 'GET',
  });
};

