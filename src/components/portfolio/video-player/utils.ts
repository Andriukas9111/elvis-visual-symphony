
/**
 * Determine if the URL is a YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  
  return url.includes('youtube.com/') || 
         url.includes('youtu.be/') || 
         url.includes('youtube-nocookie.com/');
};

// Alias for isYouTubeUrl to maintain backward compatibility
export const isYoutubeUrl = isYouTubeUrl;

/**
 * Extract the YouTube video ID from a YouTube URL
 */
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&]+)/i,
    /youtube\.com\/watch\?.*v=([^&]+)/i,
    /youtube-nocookie\.com\/embed\/([^?&]+)/i
  ];
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return '';
};

// Alias for extractYouTubeId to maintain backward compatibility
export const getYoutubeId = extractYouTubeId;

/**
 * Get file extension from URL
 */
export const getFileExtensionFromUrl = (url: string): string => {
  if (!url) return '';
  
  const filename = url.split('/').pop() || '';
  return filename.includes('.') ? filename.split('.').pop() || '' : '';
};

/**
 * Video error types for comprehensive error handling
 */
export enum VideoErrorType {
  NETWORK = 'NETWORK',
  FORMAT = 'FORMAT',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  DECODE = 'DECODE',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Interface for video error data
 */
export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
  timestamp: number;
}

/**
 * Map HTML5 media error codes to our error types
 */
export const mapMediaErrorToType = (errorCode: number | null): VideoErrorType => {
  if (!errorCode) return VideoErrorType.UNKNOWN;
  
  switch (errorCode) {
    case 1: // MEDIA_ERR_ABORTED
      return VideoErrorType.UNKNOWN;
    case 2: // MEDIA_ERR_NETWORK
      return VideoErrorType.NETWORK;
    case 3: // MEDIA_ERR_DECODE
      return VideoErrorType.DECODE;
    case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
      return VideoErrorType.FORMAT;
    default:
      return VideoErrorType.UNKNOWN;
  }
};

/**
 * Get human-readable error message based on error type
 */
export const getErrorMessage = (errorType: VideoErrorType): string => {
  switch (errorType) {
    case VideoErrorType.NETWORK:
      return 'A network error occurred. Please check your connection and try again.';
    case VideoErrorType.FORMAT:
      return 'This video format isn\'t supported by your browser.';
    case VideoErrorType.NOT_FOUND:
      return 'The video file could not be found.';
    case VideoErrorType.PERMISSION:
      return 'You don\'t have permission to access this video.';
    case VideoErrorType.DECODE:
      return 'The video is corrupted or uses an unsupported codec.';
    case VideoErrorType.UNKNOWN:
    default:
      return 'An unknown error occurred while playing the video.';
  }
};

/**
 * Create a VideoErrorData object from an error event
 */
export const createVideoErrorData = (event: Event): VideoErrorData => {
  const videoElement = event.target as HTMLVideoElement;
  const errorCode = videoElement.error ? videoElement.error.code : null;
  const errorType = mapMediaErrorToType(errorCode);
  
  return {
    type: errorType,
    message: getErrorMessage(errorType),
    code: errorCode || undefined,
    details: videoElement.error ? videoElement.error.message : undefined,
    timestamp: Date.now()
  };
};

/**
 * Check if a URL is accessible
 * @param url - The URL to check
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 */
export const isUrlAccessible = async (url: string, timeout = 5000): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return false;
  }
};

/**
 * Get a video thumbnail URL from a video URL
 * For YouTube, get the thumbnail from YouTube's thumbnail service
 * For self-hosted videos, return null
 */
export const getVideoThumbnailUrl = (videoUrl: string): string | null => {
  if (isYouTubeUrl(videoUrl)) {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      // Try to get the highest quality thumbnail
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  return null;
};

/**
 * Format video duration in seconds to MM:SS format
 */
export const formatVideoDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Check if a video format is supported by the browser
 */
export const isVideoFormatSupported = (format: string): boolean => {
  if (!format) return false;
  const video = document.createElement('video');
  return video.canPlayType(`video/${format}`) !== '';
};

/**
 * Get alternative formats for a video URL
 * This helps implement fallbacks if the primary format fails
 */
export const getAlternativeFormats = (originalUrl: string): string[] => {
  if (!originalUrl) return [];
  
  const alternativeFormats: string[] = [];
  const baseUrl = originalUrl.substring(0, originalUrl.lastIndexOf('.'));
  const currentFormat = getFileExtensionFromUrl(originalUrl).toLowerCase();
  
  // Prepare alternative formats
  if (currentFormat !== 'mp4') alternativeFormats.push(`${baseUrl}.mp4`);
  if (currentFormat !== 'webm') alternativeFormats.push(`${baseUrl}.webm`);
  if (currentFormat !== 'ogg') alternativeFormats.push(`${baseUrl}.ogg`);
  
  return alternativeFormats;
};

/**
 * Log video playback error to console (expandable to database in future)
 */
export const logVideoError = (errorData: VideoErrorData, videoInfo: { 
  url: string, 
  title: string 
}): void => {
  console.error('Video playback error:', {
    ...errorData,
    videoUrl: videoInfo.url,
    videoTitle: videoInfo.title,
    userAgent: navigator.userAgent,
    time: new Date(errorData.timestamp).toISOString()
  });
  
  // In a production environment, this would send the error to a logging endpoint
  // Example implementation commented out below:
  /*
  try {
    fetch('/api/log-video-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...errorData,
        videoUrl: videoInfo.url,
        videoTitle: videoInfo.title,
        userAgent: navigator.userAgent
      })
    });
  } catch (err) {
    console.error('Failed to log video error:', err);
  }
  */
};

/**
 * Convert bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get optimal video preload strategy based on file size and network
 */
export const getOptimalPreload = (fileSize: number | undefined): 'auto' | 'metadata' | 'none' => {
  if (!fileSize) return 'metadata';
  
  // Check if we're on a slow connection
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && 
    (connection.saveData || 
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g');
  
  // Small files and good connection: preload everything
  if (fileSize < 5 * 1024 * 1024 && !isSlowConnection) {
    return 'auto';
  }
  
  // Medium files or data saver: preload metadata only
  if (fileSize < 20 * 1024 * 1024 || isSlowConnection) {
    return 'metadata';
  }
  
  // Large files: no preload
  return 'none';
};

/**
 * Test if the browser can play a specific video
 */
export const testVideoPlayback = async (videoUrl: string): Promise<{
  canPlay: boolean;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    
    const onCanPlay = () => {
      cleanup();
      resolve({ canPlay: true });
    };
    
    const onError = () => {
      cleanup();
      resolve({ 
        canPlay: false, 
        error: video.error ? `Error code: ${video.error.code}` : 'Unknown error' 
      });
    };
    
    const cleanup = () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };
    
    // Set a timeout to avoid hanging
    const timeoutId = setTimeout(() => {
      cleanup();
      resolve({ canPlay: false, error: 'Timeout while testing video' });
    }, 5000);
    
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);
    
    video.src = videoUrl;
    video.load();
    
    // Attempt to play without sound to test
    video.muted = true;
    video.play().catch(() => {
      // Playback might be prevented by autoplay policy, but we've learned enough
      cleanup();
      clearTimeout(timeoutId);
      resolve({ canPlay: true });
    });
  });
};
