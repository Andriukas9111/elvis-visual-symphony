
export interface VideoPlayerConfig {
  autoPlay?: boolean;
  loop?: boolean;
  defaultVolume?: number;
  preloadStrategy?: 'auto' | 'metadata' | 'none';
  qualitySelection?: 'auto' | 'high' | 'medium' | 'low';
  enableTheaterMode?: boolean;
  muteOnAutoplay?: boolean;
  enableKeyboardShortcuts?: boolean;
}

export interface VideoSourceInfo {
  url: string;
  type: 'self-hosted' | 'youtube' | 'vimeo' | 'other';
  format?: string;
  quality?: string;
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
}

export interface VideoMetadata {
  duration?: number;
  width?: number;
  height?: number;
  bitrate?: number;
  framerate?: number;
  format?: string;
  codec?: string;
  thumbnail?: string;
  processedAt?: number;
}

export interface VideoUploadInfo {
  originalFileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt: number;
  uploadedBy?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}
