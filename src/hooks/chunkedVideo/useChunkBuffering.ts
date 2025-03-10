
import { useEffect, RefObject, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { bufferingManager, BufferingState } from '@/utils/upload/chunks/bufferingManager';

export function useChunkBuffering(
  videoRef: RefObject<HTMLVideoElement>,
  isPaused: boolean
) {
  const [bufferingState, setBufferingState] = useState<BufferingState>({
    isBuffering: false,
    progress: 0,
    currentTime: 0,
    duration: 0
  });

  // Monitor buffering status
  useEffect(() => {
    if (!videoRef.current || isPaused) return;

    const handleTimeUpdate = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      
      setBufferingState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime,
        duration: videoElement.duration
      }));
    };

    const handleProgress = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const progress = bufferingManager.calculateBufferProgress(
        videoElement.buffered,
        videoElement.duration
      );
      
      const isBufferingNeeded = bufferingManager.isBufferingNeeded(
        videoElement.currentTime,
        videoElement.buffered,
        videoElement.duration
      );

      setBufferingState(prev => ({
        ...prev,
        progress,
        isBuffering: isBufferingNeeded
      }));
    };
    
    const handleWaiting = () => {
      setBufferingState(prev => ({
        ...prev,
        isBuffering: true
      }));
    };
    
    const handlePlaying = () => {
      setBufferingState(prev => ({
        ...prev,
        isBuffering: false
      }));
    };

    videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    videoRef.current.addEventListener('progress', handleProgress);
    videoRef.current.addEventListener('waiting', handleWaiting);
    videoRef.current.addEventListener('playing', handlePlaying);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('progress', handleProgress);
        videoRef.current.removeEventListener('waiting', handleWaiting);
        videoRef.current.removeEventListener('playing', handlePlaying);
      }
    };
  }, [videoRef, isPaused]);

  return { bufferingState };
}

// Re-export renamed function to maintain backward compatibility
export const useVideoBuffering = useChunkBuffering;

