// Video player types and utilities

export enum VideoErrorType {
  LOADING = 'loading',
  PLAYBACK = 'playback',
  MEDIA = 'media',
  NETWORK = 'network',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
}

// Add any other utility functions here
