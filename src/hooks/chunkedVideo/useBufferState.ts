
import { useState, useEffect, useCallback } from 'react';
import { VideoErrorType, VideoErrorData } from '@/components/portfolio/video-player/utils';

interface UseBufferStateProps {
  videoElement: HTMLVideoElement | null;
  onError?: (error: VideoErrorData) => void;
}

export const useBufferState = ({ 
  videoElement, 
  onError 
}: UseBufferStateProps) => {
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  
  // Handle buffering state changes
  const handleBufferingChange = useCallback(() => {
    if (!videoElement) return;
    
    // Check if the video is currently waiting for more data
    const isCurrentlyBuffering = videoElement.readyState < 3;
    setIsBuffering(isCurrentlyBuffering);
    
    // Calculate buffer progress
    if (videoElement.buffered.length > 0 && videoElement.duration > 0) {
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      const duration = videoElement.duration;
      const progress = (bufferedEnd / duration) * 100;
      setBufferProgress(Math.min(100, Math.round(progress)));
    }
  }, [videoElement]);
  
  // Handle buffer progress updates
  const updateBufferProgress = useCallback(() => {
    if (!videoElement) return;
    
    try {
      if (videoElement.buffered.length > 0 && videoElement.duration > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
        const duration = videoElement.duration;
        const progress = (bufferedEnd / duration) * 100;
        setBufferProgress(Math.min(100, Math.round(progress)));
      }
    } catch (error) {
      console.error('Error updating buffer progress:', error);
      
      if (onError) {
        onError({
          type: VideoErrorType.LOADING,
          message: 'Error tracking video buffer progress',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });
      }
    }
  }, [videoElement, onError]);
  
  // Set up event listeners for buffering
  useEffect(() => {
    if (!videoElement) return;
    
    // Waiting event indicates buffering has started
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    // Playing event may indicate buffering has ended
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    
    // Progress event updates buffer information
    const handleProgress = () => {
      updateBufferProgress();
      handleBufferingChange();
    };
    
    // Initial check
    handleBufferingChange();
    
    // Add event listeners
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('timeupdate', updateBufferProgress);
    
    // Cleanup
    return () => {
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('progress', handleProgress);
      videoElement.removeEventListener('timeupdate', updateBufferProgress);
    };
  }, [videoElement, handleBufferingChange, updateBufferProgress]);
  
  return {
    isBuffering,
    bufferProgress
  };
};
