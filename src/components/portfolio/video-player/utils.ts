export enum VideoErrorType {
  FORMAT = 'FORMAT',
  NOT_FOUND = 'NOT_FOUND',
  DECODE = 'DECODE',
  PERMISSION = 'PERMISSION',
  MEDIA = 'MEDIA',
  NETWORK = 'NETWORK',
  LOAD = 'LOAD'
}

export interface VideoErrorData {
  type: VideoErrorType;
  message: string;
  code?: number;
  details?: any;
  timestamp?: number;
  success?: boolean;
  error?: any;
}

export const testVideoPlayback = async (url: string): Promise<VideoErrorData | null> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.style.display = 'none';

    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
      resolve(null);
      video.remove();
    });

    video.addEventListener('error', (event) => {
      console.error('Video playback error:', event);
      let errorType = VideoErrorType.FORMAT;
      let errorMessage = 'An unknown error occurred.';

      switch (video.error?.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'The video download was aborted.';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'A network error caused the video download to fail.';
          errorType = VideoErrorType.NOT_FOUND;
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
          errorType = VideoErrorType.DECODE;
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'The video could not be loaded, either because the server or network failed or because the format is not supported.';
          errorType = VideoErrorType.FORMAT;
          break;
        default:
          errorMessage = `An unexpected error occurred (code: ${video.error?.code}).`;
          break;
      }

      const errorData: VideoErrorData = {
        type: errorType,
        message: errorMessage,
      };
      resolve(errorData);
      video.remove();
    });

    video.src = url;
  });
};

export const isYoutubeUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(url);
};

export const getYoutubeId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Adding aliases for backward compatibility
export const isYouTubeUrl = isYoutubeUrl;
export const extractYouTubeId = getYoutubeId;

// Adding missing utility functions
export const logVideoError = (error: VideoErrorData, context?: any): void => {
  console.error("Video Error:", error, context);
};

export const getOptimalPreload = (fileSize?: number): 'auto' | 'metadata' | 'none' => {
  if (!fileSize) return 'metadata';
  
  // For small files (< 5MB), we can preload the whole video
  if (fileSize < 5 * 1024 * 1024) return 'auto';
  
  // For medium files (< 20MB), preload metadata only
  return 'metadata';
};
