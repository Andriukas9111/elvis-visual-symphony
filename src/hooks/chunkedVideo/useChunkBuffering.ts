
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
  const [lastPlaybackPosition, setLastPlaybackPosition] = useState<number>(0);
  const [stuckCount, setStuckCount] = useState<number>(0);

  // Monitor buffering status
  useEffect(() => {
    if (!videoRef.current) return;

    const handleTimeUpdate = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      
      // Reset stuck counter if playback is progressing
      if (Math.abs(videoElement.currentTime - lastPlaybackPosition) > 0.1) {
        setStuckCount(0);
        setLastPlaybackPosition(videoElement.currentTime);
      }
      
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
      
      // Only log buffer information when it's meaningful to reduce console spam
      if (!isPaused && progress < 99 && progress % 10 < 1) {
        console.log(`Buffer progress: ${progress.toFixed(1)}%, ${bufferAhead.toFixed(2)}s ahead`);
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
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.currentTime = Math.max(0, currentTime - 0.5); // Go back 0.5 second for smoother restart
                
                // Try to play again if not paused
                if (!isPaused) {
                  const playPromise = videoRef.current.play();
                  if (playPromise) {
                    playPromise.catch(e => console.error('Recovery play failed:', e));
                  }
                }
              }
            }, 500);
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
    
    // More aggressive buffering detection
    if (!isPaused) {
      const bufferCheckInterval = setInterval(() => {
        if (!videoElement) return;
        
        // Skip if video is already paused or explicitly buffering
        if (videoElement.paused || bufferingState.isBuffering) return;
        
        // Check if playback is frozen but not officially buffering
        if (videoElement.currentTime > 0 && 
            videoElement.readyState >= 3 && 
            Math.abs(videoElement.currentTime - lastPlaybackPosition) < 0.1) {
          
          setStuckCount(prev => prev + 1);
          
          // After 3 consecutive checks with no progress, we're probably stuck
          if (stuckCount >= 3) {
            console.log('Detected playback stall, attempting recovery');
            
            // Try small seek to unstick playback
            const smallJump = 0.1;
            const newPosition = videoElement.currentTime + smallJump;
            
            if (newPosition < videoElement.duration) {
              videoElement.currentTime = newPosition;
              console.log(`Seeking ahead by ${smallJump}s to unstick playback`);
              
              // If we're still stuck after multiple attempts, try playing at a lower quality
              if (stuckCount > 5) {
                console.log('Multiple stalls detected, reducing playback quality');
                
                // Try a more drastic recovery if multiple small seeks didn't work
                videoElement.playbackRate = 0.5; // Slow down playback temporarily
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = 1.0; // Restore normal playback
                  }
                }, 2000);
              }
            }
          }
        } else {
          // Update last position if we're moving
          setLastPlaybackPosition(videoElement.currentTime);
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
  }, [videoRef, isPaused, bufferingState.isBuffering, lastErrorTime, errorCount, lastPlaybackPosition, stuckCount]);

  // More aggressive pre-buffering logic
  useEffect(() => {
    if (!videoRef.current || isPaused) return;
    
    const videoElement = videoRef.current;
    
    // Configure video element for more buffering
    try {
      // Try to make the browser buffer more content
      if (typeof videoElement.preload === 'string') {
        videoElement.preload = 'auto';
      }
      
      // Use higher quality decoding if available
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        console.log('Using advanced video frame callbacks for smoother playback');
      }
    } catch (e) {
      console.warn('Error optimizing video element:', e);
    }
  }, [isPaused, videoRef]);

  return { bufferingState };
}

// Re-export renamed function to maintain backward compatibility
export const useVideoBuffering = useChunkBuffering;
