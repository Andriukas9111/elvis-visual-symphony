
export enum VideoErrorType {
  PLAYBACK = 'playback',
  MEDIA = 'media',
  NETWORK = 'network',
  LOAD = 'load',
  DECODE = 'decode',
  FORMAT = 'format',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
  timestamp?: number; // Adding timestamp as it's used in several places
}

export interface VideoPlayerControlsProps {
  isPlaying?: boolean;
  playing?: boolean;
  currentTime: number;
  duration: number;
  volume?: number;
  isMuted?: boolean;
  muted?: boolean;
  togglePlay: () => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onSeek?: (time: number) => void;
  onFullscreen?: () => void;
  
  // Additional props used in SelfHostedPlayer.tsx
  loading?: boolean;
  bufferProgress?: number;
  onPlayPause?: () => void;
  onMute?: () => void;
  title?: string;
  
  // Additional props used in index.tsx
  fullscreen?: boolean;
  toggleFullscreen?: () => void;
  skipBackward?: () => void;
  skipForward?: () => void;
  closeVideo?: () => void;
}

export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('youtube.com/embed/') || 
    url.includes('youtube.com/watch') || 
    url.includes('youtu.be/')
  );
};

// Adding alias for different casing
export const isYoutubeUrl = isYouTubeUrl;

export const getEmbedUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  
  // Already an embed URL
  if (videoUrl.includes('youtube.com/embed/')) {
    return videoUrl;
  }
  
  // Convert YouTube watch URL
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Convert YouTube short URL
  if (videoUrl.includes('youtu.be/')) {
    const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Not a YouTube URL, return as is
  return videoUrl;
};

// Function to extract YouTube video ID from various URL formats
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Match YouTube video ID patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Adding alias for different casing
export const getYoutubeId = extractYouTubeId;

// Function to determine optimal preload strategy based on file size
export const getOptimalPreload = (fileSize?: number): 'auto' | 'metadata' | 'none' => {
  if (!fileSize) return 'metadata';
  
  // For small files under 5MB, we can preload
  if (fileSize < 5 * 1024 * 1024) return 'auto';
  
  // For medium-sized files, just load metadata
  if (fileSize < 50 * 1024 * 1024) return 'metadata';
  
  // For large files, don't preload
  return 'none';
};

// Function to test if a video URL is playable
export const testVideoPlayback = async (videoUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(false);
      return;
    }
    
    if (isYouTubeUrl(videoUrl)) {
      // For YouTube, we assume it's valid if we can extract an ID
      const id = extractYouTubeId(videoUrl);
      resolve(!!id);
      return;
    }
    
    // For direct video URLs, create a video element to test
    const video = document.createElement('video');
    
    // Set up timeout to prevent long hanging
    const timeout = setTimeout(() => {
      video.removeAttribute('src');
      video.load();
      resolve(false);
    }, 5000);
    
    // Set up listeners
    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    
    video.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    
    // Start loading the video
    video.preload = 'metadata';
    video.src = videoUrl;
    video.load();
  });
};
