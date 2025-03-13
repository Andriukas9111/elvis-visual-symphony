
import { useState, useRef, useCallback } from 'react';
import { VideoErrorData, VideoErrorType } from '@/components/portfolio/video-player/utils';

export interface UseBufferStateProps {
  onError?: (error: VideoErrorData) => void;
}

export const useBufferState = (props?: UseBufferStateProps) => {
  const { onError } = props || {};
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);

  // Handle video waiting/buffering event
  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  // Handle video can play event
  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
    setBufferProgress(100);
  }, []);

  // Handle video error
  const handleVideoError = useCallback((event: ErrorEvent | Event) => {
    setIsBuffering(false);
    
    const errorData: VideoErrorData = {
      type: VideoErrorType.UNKNOWN,
      message: 'An unknown error occurred during playback',
      timestamp: Date.now()
    };
    
    // If we have access to the error details, use them
    if ('error' in event.target) {
      const mediaError = (event.target as HTMLMediaElement).error;
      if (mediaError) {
        switch (mediaError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorData.type = VideoErrorType.PLAYBACK;
            errorData.message = 'Playback aborted by user';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorData.type = VideoErrorType.NETWORK;
            errorData.message = 'Network error occurred during playback';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorData.type = VideoErrorType.DECODE;
            errorData.message = 'Video decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorData.type = VideoErrorType.FORMAT;
            errorData.message = 'Video format not supported';
            break;
        }
        errorData.code = mediaError.code;
      }
    }
    
    if (onError) {
      onError(errorData);
    }
  }, [onError]);

  return {
    isBuffering,
    bufferProgress,
    handleWaiting,
    handleCanPlay,
    handleVideoError
  };
};
