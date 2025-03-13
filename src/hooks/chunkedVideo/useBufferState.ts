
import { useState, useEffect } from 'react';
import { VideoErrorData, VideoErrorType } from '@/components/portfolio/video-player/utils';

export interface BufferState {
  isBuffering: boolean;
  progress: number;
}

interface UseBufferStateProps {
  videoElement: HTMLVideoElement | null;
  onError?: (error: VideoErrorData) => void;
}

export const useBufferState = ({ videoElement, onError }: UseBufferStateProps) => {
  const [bufferState, setBufferState] = useState<BufferState>({
    isBuffering: false,
    progress: 0
  });

  useEffect(() => {
    if (!videoElement) return;

    const handleWaiting = () => {
      setBufferState(prev => ({ ...prev, isBuffering: true }));
    };

    const handlePlaying = () => {
      setBufferState(prev => ({ ...prev, isBuffering: false }));
    };

    const handleProgress = () => {
      if (videoElement.buffered.length > 0 && videoElement.duration > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
        const progress = (bufferedEnd / videoElement.duration) * 100;
        setBufferState(prev => ({ ...prev, progress }));
      }
    };

    const handleError = (event: Event) => {
      console.error('Buffer state error:', event);
      
      if (onError && videoElement.error) {
        onError({
          type: VideoErrorType.BUFFER,
          message: 'Video buffering error',
          code: videoElement.error.code,
          details: videoElement.error,
          timestamp: Date.now()
        });
      }
      
      setBufferState(prev => ({ ...prev, isBuffering: false }));
    };

    // Add event listeners
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('error', handleError);

    // Cleanup
    return () => {
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('progress', handleProgress);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoElement, onError]);

  return bufferState;
};
