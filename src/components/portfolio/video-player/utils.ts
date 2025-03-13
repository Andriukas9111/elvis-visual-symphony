
// Video player types and utilities

export enum VideoErrorType {
  LOADING = 'loading',
  PLAYBACK = 'playback',
  MEDIA = 'media',
  NETWORK = 'network',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
  FORMAT = 'format',
  NOT_FOUND = 'not_found',
  DECODE = 'decode',
  LOAD = 'load',
  BUFFER = 'buffer' // Add the buffer error type
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
  timestamp?: number; // Add timestamp for error tracking
}

// YouTube utility functions
export const isYoutubeUrl = (url: string): boolean => {
  return url && (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('youtube-nocookie.com')
  );
};

// Alias for consistency in different files
export const isYouTubeUrl = isYoutubeUrl;

export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  let match;
  // youtube.com/watch?v=ID
  if (url.includes('youtube.com/watch')) {
    match = url.match(/[?&]v=([^&#]*)/);
    return match ? match[1] : null;
  }
  // youtu.be/ID
  if (url.includes('youtu.be')) {
    match = url.match(/youtu\.be\/([^/?#]*)/);
    return match ? match[1] : null;
  }
  // youtube.com/embed/ID
  if (url.includes('/embed/')) {
    match = url.match(/\/embed\/([^/?#]*)/);
    return match ? match[1] : null;
  }
  // youtube.com/shorts/ID
  if (url.includes('/shorts/')) {
    match = url.match(/\/shorts\/([^/?#]*)/);
    return match ? match[1] : null;
  }
  return null;
};

// Alias for extractYouTubeId
export const extractYouTubeId = getYoutubeId;

// Video playback testing utility
export const testVideoPlayback = async (videoUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    
    // Set up event handlers
    video.onloadeddata = () => {
      // Video can be played
      resolve(true);
      video.remove();
    };
    
    video.onerror = () => {
      // Video cannot be played
      resolve(false);
      video.remove();
    };
    
    // Set a timeout in case video loading hangs
    const timeout = setTimeout(() => {
      resolve(false);
      video.remove();
    }, 5000);
    
    // Load the video
    video.src = videoUrl;
    video.load();
    
    // Cleanup on success
    video.onloadeddata = () => {
      clearTimeout(timeout);
      resolve(true);
      video.remove();
    };
  });
};

// Get optimal preload strategy based on file size and network conditions
export const getOptimalPreload = (fileSize?: number): 'auto' | 'metadata' | 'none' => {
  // Default conservative approach
  if (!fileSize) return 'metadata';
  
  // For small files, preload everything
  if (fileSize < 5 * 1024 * 1024) return 'auto'; // Less than 5MB
  
  // For medium-sized files, check connection type if available
  if (fileSize < 20 * 1024 * 1024) {
    // @ts-ignore - Some browsers support connection info
    if (navigator.connection && 
        // @ts-ignore - Check effective connection type
        ['wifi', '4g'].includes(navigator.connection.effectiveType)) {
      return 'auto';
    }
    return 'metadata';
  }
  
  // For large files, only load metadata
  return 'metadata';
};
