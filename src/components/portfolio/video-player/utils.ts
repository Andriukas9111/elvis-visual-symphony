

export enum VideoErrorType {
  NETWORK = 'NETWORK',
  FORMAT = 'FORMAT',
  MEDIA = 'MEDIA',
  UNKNOWN = 'UNKNOWN',
  PLAYBACK = 'PLAYBACK',
  ACCESS = 'ACCESS',
  NOT_FOUND = 'NOT_FOUND',
  DECODE = 'DECODE',
  PERMISSION = 'PERMISSION',
  LOAD = 'LOAD'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  details?: any;
  code?: number;
  timestamp?: number;
}

/**
 * Checks if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return url && (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.startsWith('youtube:')
  );
}

// Adding alias for consistent naming across codebase
export const isYoutubeUrl = isYouTubeUrl;

/**
 * Extracts YouTube ID from a YouTube URL
 */
export function extractYouTubeId(url: string): string {
  if (!url) return '';
  
  if (url.startsWith('youtube:')) {
    return url.replace('youtube:', '');
  }

  // Handle youtu.be URLs
  if (url.includes('youtu.be')) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }
  
  // Handle youtube.com URLs
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

// Adding alias for consistent naming across codebase
export const getYoutubeId = extractYouTubeId;

/**
 * Checks if a YouTube URL is a YouTube Short
 */
export function isYouTubeShort(url: string): boolean {
  const shortPattern = /youtube\.com\/shorts\//i;
  return shortPattern.test(url);
}

/**
 * Format time in seconds to MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) {
    return '00:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Create a standardized video error data object
 */
export function createVideoErrorData(
  type: VideoErrorType,
  message: string,
  details?: any,
  code?: number
): VideoErrorData {
  return {
    type,
    message,
    details,
    code,
    timestamp: Date.now()
  };
}

/**
 * Log video error to console and analytics (if available)
 */
export function logVideoError(error: VideoErrorData, context?: { url?: string; title?: string }) {
  console.error('Video Error:', error, context);
  
  // Add analytics tracking here if needed
  try {
    // This is where you would send the error to your analytics service
    // For now, we just log to console
  } catch (e) {
    console.error('Error logging video error:', e);
  }
}

/**
 * Determine optimal preload strategy based on file size and user preferences
 */
export function getOptimalPreload(fileSize?: number, userPreference?: string): 'auto' | 'metadata' | 'none' {
  // If user explicitly set a preference, use that
  if (userPreference && ['auto', 'metadata', 'none'].includes(userPreference)) {
    return userPreference as 'auto' | 'metadata' | 'none';
  }
  
  // If file size is provided, make a decision based on size
  if (fileSize) {
    // If file is larger than 10MB, only preload metadata to save bandwidth
    if (fileSize > 10 * 1024 * 1024) {
      return 'metadata';
    }
    // If file is larger than 50MB, don't preload at all
    if (fileSize > 50 * 1024 * 1024) {
      return 'none';
    }
  }
  
  // Default to metadata which is a good balance
  return 'metadata';
}

/**
 * Test if a video URL is playable
 */
export async function testVideoPlayback(url: string): Promise<{ success: boolean; error?: VideoErrorData }> {
  if (!url) {
    return {
      success: false,
      error: createVideoErrorData(
        VideoErrorType.UNKNOWN,
        'No URL provided',
        null
      )
    };
  }
  
  // If it's a YouTube URL, we'll assume it's valid for now
  if (isYouTubeUrl(url)) {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return {
        success: false,
        error: createVideoErrorData(
          VideoErrorType.FORMAT,
          'Invalid YouTube URL format',
          { url }
        )
      };
    }
    return { success: true };
  }
  
  // For direct video URLs, try a HEAD request first
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return {
        success: false,
        error: createVideoErrorData(
          VideoErrorType.NOT_FOUND,
          `Server returned status ${response.status}`,
          { status: response.status },
          response.status
        )
      };
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('video/')) {
      return {
        success: false,
        error: createVideoErrorData(
          VideoErrorType.FORMAT,
          `Invalid content type: ${contentType}`,
          { contentType }
        )
      };
    }
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: createVideoErrorData(
        VideoErrorType.NETWORK,
        error.message || 'Network error occurred',
        error
      )
    };
  }
}
