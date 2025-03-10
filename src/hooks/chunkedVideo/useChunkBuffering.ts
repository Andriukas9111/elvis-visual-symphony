
import { useEffect, RefObject, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface PreBufferingState {
  isPreBuffering: boolean;
  preBufferingProgress: number;
  preBufferingError: string | null;
  preBufferedChunk: number | null;
}

export function useChunkBuffering(
  videoRef: RefObject<HTMLVideoElement>,
  nextChunkRef: RefObject<HTMLVideoElement>,
  chunkUrls: string[],
  currentChunk: number,
  isPaused: boolean,
  preBufferedRef: React.MutableRefObject<boolean>
) {
  // Add state to track pre-buffering progress and errors
  const [preBufferingState, setPreBufferingState] = useState<PreBufferingState>({
    isPreBuffering: false,
    preBufferingProgress: 0,
    preBufferingError: null,
    preBufferedChunk: null
  });

  // Helper to reset pre-buffering state
  const resetPreBufferingState = useCallback(() => {
    setPreBufferingState({
      isPreBuffering: false,
      preBufferingProgress: 0,
      preBufferingError: null,
      preBufferedChunk: null
    });
    preBufferedRef.current = false;
  }, [preBufferedRef]);

  // More robust pre-buffering function 
  const preBufferNextChunk = useCallback((nextChunkIndex: number) => {
    if (!nextChunkRef.current || nextChunkIndex >= chunkUrls.length) {
      return;
    }
    
    // Update state to indicate pre-buffering has started
    setPreBufferingState(prev => ({
      ...prev,
      isPreBuffering: true,
      preBufferingError: null,
      preBufferingProgress: 0,
      preBufferedChunk: nextChunkIndex
    }));
    
    console.log(`Pre-buffering next chunk (${nextChunkIndex + 1}/${chunkUrls.length})`);
    
    try {
      // Clear any existing event listeners
      const videoElement = nextChunkRef.current;
      const existingListeners = videoElement.getAttribute('data-has-listeners') === 'true';
      
      if (existingListeners) {
        videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
        videoElement.removeEventListener('progress', onProgress);
        videoElement.removeEventListener('error', onError);
        videoElement.removeEventListener('abort', onAbort);
      }
      
      // Set source and load
      videoElement.src = chunkUrls[nextChunkIndex];
      videoElement.setAttribute('data-has-listeners', 'true');
      
      // Define event handlers for tracking pre-buffering
      function onCanPlayThrough() {
        console.log(`Next chunk (${nextChunkIndex + 1}) preloaded successfully`);
        preBufferedRef.current = true;
        setPreBufferingState(prev => ({
          ...prev, 
          isPreBuffering: false,
          preBufferingProgress: 100
        }));
      }
      
      function onProgress(e: Event) {
        if (videoElement.buffered.length) {
          const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
          const duration = videoElement.duration;
          
          if (duration > 0) {
            const loadedPercentage = Math.round((bufferedEnd / duration) * 100);
            setPreBufferingState(prev => ({
              ...prev,
              preBufferingProgress: loadedPercentage
            }));
          }
        }
      }
      
      function onError(e: ErrorEvent) {
        const error = videoElement.error;
        console.error(`Error pre-buffering chunk ${nextChunkIndex + 1}:`, error?.message || 'Unknown error');
        
        preBufferedRef.current = false;
        setPreBufferingState(prev => ({
          ...prev,
          isPreBuffering: false,
          preBufferingError: error?.message || 'Failed to pre-buffer next chunk'
        }));
        
        // Try to recover by retrying once
        retryPreBuffering(nextChunkIndex);
      }
      
      function onAbort() {
        console.warn(`Pre-buffering aborted for chunk ${nextChunkIndex + 1}`);
        preBufferedRef.current = false;
        setPreBufferingState(prev => ({
          ...prev,
          isPreBuffering: false,
          preBufferingError: 'Pre-buffering was aborted'
        }));
      }
      
      // Add event listeners
      videoElement.addEventListener('canplaythrough', onCanPlayThrough);
      videoElement.addEventListener('progress', onProgress);
      videoElement.addEventListener('error', onError);
      videoElement.addEventListener('abort', onAbort);
      
      // Start loading
      videoElement.load();
    } catch (error) {
      console.error('Exception during pre-buffering setup:', error);
      
      // Reset and try to recover
      resetPreBufferingState();
      retryPreBuffering(nextChunkIndex);
    }
  }, [chunkUrls, nextChunkRef, preBufferedRef, resetPreBufferingState]);
  
  // Retry mechanism for failed pre-buffering
  const retryPreBuffering = useCallback((chunkIndex: number) => {
    // Check if we already attempted a retry for this chunk
    const hasRetried = nextChunkRef.current?.getAttribute('data-retry-attempted') === 'true';
    
    if (!hasRetried && nextChunkRef.current) {
      console.log(`Retrying pre-buffering for chunk ${chunkIndex + 1}`);
      
      // Mark that we've attempted a retry
      nextChunkRef.current.setAttribute('data-retry-attempted', 'true');
      
      // Wait a second before retrying
      setTimeout(() => {
        try {
          // Reset everything and try again
          if (nextChunkRef.current) {
            nextChunkRef.current.src = '';
            
            // Try pre-buffering again
            preBufferNextChunk(chunkIndex);
          }
        } catch (e) {
          console.error('Retry pre-buffering failed:', e);
          
          // Show a toast for persistent failure
          toast({
            title: "Video Buffering Issue",
            description: "Could not pre-buffer the next segment. Playback may stutter."
          });
          
          // Reset state
          resetPreBufferingState();
        }
      }, 1000);
    } else {
      // If we already tried retrying, just reset
      resetPreBufferingState();
    }
  }, [nextChunkRef, preBufferNextChunk, resetPreBufferingState]);

  // Pre-buffer the next chunk when the current chunk is playing
  useEffect(() => {
    // Reset retry flag when changing chunks
    if (nextChunkRef.current) {
      nextChunkRef.current.setAttribute('data-retry-attempted', 'false');
    }
    
    const handleTimeUpdate = () => {
      if (videoRef.current && !preBufferedRef.current) {
        const videoElement = videoRef.current;
        const duration = videoElement.duration;
        const currentTime = videoElement.currentTime;
        
        // Start pre-buffering when we're 80% through the current chunk
        // or when less than 5 seconds remain, whichever comes first
        const timeThreshold = Math.min(duration * 0.8, duration - 5);
        
        if (duration > 0 && currentTime >= timeThreshold) {
          const nextChunkIndex = currentChunk + 1;
          
          if (nextChunkIndex < chunkUrls.length && !isPaused) {
            preBufferNextChunk(nextChunkIndex);
          }
        }
      }
    };

    // Clean up pre-buffering on chunk change
    if (preBufferingState.preBufferedChunk !== null && 
        preBufferingState.preBufferedChunk !== currentChunk + 1) {
      resetPreBufferingState();
    }

    if (videoRef.current && chunkUrls.length > 1) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [
    currentChunk, 
    chunkUrls, 
    isPaused, 
    nextChunkRef, 
    videoRef, 
    preBufferedRef, 
    preBufferNextChunk, 
    preBufferingState.preBufferedChunk,
    resetPreBufferingState
  ]);

  return { preBufferingState };
}
