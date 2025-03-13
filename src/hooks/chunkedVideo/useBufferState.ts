
import { useState, useCallback, RefObject } from 'react';
import { VideoErrorType } from '@/components/portfolio/video-player/utils';
import { UseChunkedVideoProps } from './types';

interface UseBufferStateProps {
  videoRef: RefObject<HTMLVideoElement>;
  currentChunk: number;
  chunkUrls: string[];
  onError?: UseChunkedVideoProps['onError'];
}

export function useBufferState({
  videoRef,
  currentChunk,
  chunkUrls,
  onError
}: UseBufferStateProps) {
  const [isBuffering, setIsBuffering] = useState(false);

  // Buffering handlers
  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  // Video error handler
  const handleVideoError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = event.currentTarget;
    const errorCode = videoElement.error?.code;
    const errorMessage = videoElement.error?.message || 'Unknown video error';
    
    console.error('Video playback error:', {
      code: errorCode,
      message: errorMessage,
      currentChunk: currentChunk + 1,
      totalChunks: chunkUrls.length,
      src: videoElement.src
    });
    
    if (onError) {
      onError({
        type: VideoErrorType.MEDIA,
        message: errorMessage,
        code: errorCode,
        timestamp: Date.now()
      });
    }
    
    // Try to recover by resetting src if possible
    if (chunkUrls[currentChunk] && videoRef.current) {
      console.log(`Attempting recovery by reloading current chunk`);
      videoRef.current.src = chunkUrls[currentChunk];
      videoRef.current.load();
    }
  }, [onError, currentChunk, chunkUrls, videoRef]);

  return {
    isBuffering,
    setIsBuffering,
    handleWaiting,
    handleCanPlay,
    handleVideoError
  };
}
