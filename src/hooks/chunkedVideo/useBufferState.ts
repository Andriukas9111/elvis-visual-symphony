
import { useState, useCallback } from 'react';
import { VideoErrorData } from '@/components/portfolio/video-player/utils';

export interface BufferState {
  isBuffering: boolean;
  bufferProgress: number;
  error: VideoErrorData | null;
  handleWaiting: () => void;
  handleCanPlay: () => void;
  handleVideoError: (error: VideoErrorData) => void;
}

export interface UseBufferStateProps {
  onError?: (error: VideoErrorData) => void;
}

export const useBufferState = (props?: UseBufferStateProps): BufferState => {
  const { onError } = props || {};
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [error, setError] = useState<VideoErrorData | null>(null);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
    setBufferProgress(100);
  }, []);

  const handleVideoError = useCallback((errorData: VideoErrorData) => {
    setError(errorData);
    setIsBuffering(false);
    
    if (onError) {
      onError(errorData);
    }
  }, [onError]);

  // Update buffer progress
  const updateBufferProgress = useCallback((progress: number) => {
    setBufferProgress(Math.min(progress, 100));
  }, []);

  return {
    isBuffering,
    bufferProgress,
    error,
    handleWaiting,
    handleCanPlay,
    handleVideoError,
  };
};
