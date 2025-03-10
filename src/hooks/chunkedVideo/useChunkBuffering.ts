
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
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);

  // Monitor buffering status
  useEffect(() => {
    if (!videoRef.current) return;

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
      
      const bufferAhead = bufferingManager.getBufferedAheadTime(
        videoElement.currentTime,
        videoElement.buffered
      );
      
      // Log buffer information for debugging
      if (!isPaused && progress < 99) {
        console.log(`Buffer progress: ${progress}%, ${bufferAhead.toFixed(2)}s ahead`);
      }
      
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
      console.log('Video is waiting for data...');
      setBufferingState(prev => ({
        ...prev,
        isBuffering: true
      }));
    };
    
    const handlePlaying = () => {
      console.log('Video playback resumed');
      setBufferingState(prev => ({
        ...prev,
        isBuffering: false
      }));
    };
    
    const handleError = (e: Event) => {
      const now = Date.now();
      const videoElement = videoRef.current;
      
      // Only process errors if they're not too frequent (throttle)
      if (now - lastErrorTime > 5000) {
        setLastErrorTime(now);
        setErrorCount(count => count + 1);
        
        const error = videoElement?.error;
        console.error('Video playback error:', {
          code: error?.code,
          message: error?.message,
          time: new Date().toISOString(),
          currentTime: videoElement?.currentTime,
          readyState: videoElement?.readyState,
          networkState: videoElement?.networkState,
          src: videoElement?.src
        });
        
        // Only show a toast for critical errors and not too frequently
        if (errorCount < 3) {
          toast({
            title: "Video playback issue",
            description: "Buffering video, please wait...",
            duration: 3000
          });
        }
        
        // Try to recover automatically
        if (videoElement && videoElement.src) {
          console.log('Attempting to recover playback...');
          
          // Save current time before reload attempt
          const currentTime = videoElement.currentTime;
          
          // Force reload the video if we're really stuck
          if (errorCount > 3 && !isPaused) {
            videoElement.load();
            
            // Restore playback position
            videoElement.currentTime = Math.max(0, currentTime - 1); // Go back 1 second for smoother restart
            
            // Try to play again if not paused
            if (!isPaused) {
              const playPromise = videoElement.play();
              if (playPromise) {
                playPromise.catch(e => console.error('Recovery play failed:', e));
              }
            }
          }
        }
      }
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('error', handleError);
    
    // Implement our own buffering detection
    if (!isPaused) {
      const bufferCheckInterval = setInterval(() => {
        if (!videoElement) return;
        
        // Check if playback is frozen but not officially buffering
        if (!videoElement.paused && 
            videoElement.currentTime > 0 && 
            videoElement.readyState >= 3 && 
            !bufferingState.isBuffering) {
          
          // Get the last position and check again in a moment
          const lastPosition = videoElement.currentTime;
          
          setTimeout(() => {
            // If position hasn't changed but video isn't paused, we might be invisibly buffering
            if (videoElement && 
                !videoElement.paused && 
                videoElement.currentTime === lastPosition) {
              console.log('Detected playback stall, attempting recovery');
              
              // Force a small seek to unstick playback
              videoElement.currentTime += 0.1;
            }
          }, 300);
        }
      }, 1000);
      
      return () => clearInterval(bufferCheckInterval);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('progress', handleProgress);
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('error', handleError);
      }
    };
  }, [videoRef, isPaused, bufferingState.isBuffering, lastErrorTime, errorCount]);

  // When video starts playing, preload more aggressively
  useEffect(() => {
    if (videoRef.current && !isPaused) {
      // Set a higher playback rate briefly to cache more content
      const videoElement = videoRef.current;
      
      // Attempt to increase buffer size by manipulating playbackRate
      const originalRate = videoElement.playbackRate;
      
      // Only boost if we have enough buffer
      const bufferAhead = bufferingManager.getBufferedAheadTime(
        videoElement.currentTime,
        videoElement.buffered
      );
      
      if (bufferAhead > 3) {
        // Temporarily increase playback rate to load more content
        videoElement.playbackRate = originalRate * 1.05;
        
        // Reset after a short duration
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = originalRate;
          }
        }, 200);
      }
    }
  }, [isPaused, videoRef]);

  return { bufferingState };
}

// Re-export renamed function to maintain backward compatibility
export const useVideoBuffering = useChunkBuffering;
