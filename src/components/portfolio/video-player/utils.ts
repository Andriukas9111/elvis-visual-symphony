
/**
 * Utility functions for video player components
 */

export enum VideoErrorType {
  NETWORK = 'network',
  MEDIA = 'media',
  OTHER = 'other'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  timestamp: number;
}

/**
 * Checks if a URL is a YouTube URL
 */
export const isYoutubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Checks if a URL is specifically a YouTube Shorts URL
 */
export const isYoutubeShort = (url: string): boolean => {
  return isYoutubeUrl(url) && url.includes('/shorts/');
};

/**
 * Extracts the YouTube ID from a YouTube URL
 */
export const getYoutubeId = (url: string): string | null => {
  if (!isYoutubeUrl(url)) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Determines optimal preload value based on file size
 */
export const getOptimalPreload = (fileSize?: number, defaultPreload: 'auto' | 'metadata' | 'none' = 'metadata'): 'auto' | 'metadata' | 'none' => {
  if (!fileSize) return defaultPreload;
  
  // Convert to MB for easier comparison
  const fileSizeMB = fileSize / (1024 * 1024);
  
  if (fileSizeMB < 5) {
    // Small files can be preloaded entirely
    return 'auto';
  } else if (fileSizeMB < 20) {
    // Medium files should at least load metadata
    return 'metadata';
  } else {
    // Large files shouldn't preload
    return 'none';
  }
};
