
import { useState, useCallback, useRef, RefObject } from 'react';

interface UsePlayPauseProps {
  videoRef: RefObject<HTMLVideoElement>;
  status: 'loading' | 'buffering' | 'ready' | 'error';
  autoPlay: boolean;
  onPlay?: () => void;
}

export function usePlayPause({
  videoRef,
  status,
  autoPlay,
  onPlay
}: UsePlayPauseProps) {
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const hasPlayedRef = useRef<boolean>(false);
  const lastPlayPromiseRef = useRef<Promise<void> | null>(null);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(() => {
    if (status !== 'ready') return;
    
    if (isPaused) {
      if (videoRef.current) {
        try {
          // Cancel any ongoing play promises to avoid conflicts
          if (lastPlayPromiseRef.current) {
            lastPlayPromiseRef.current.catch(() => {});
            lastPlayPromiseRef.current = null;
          }
          
          const playPromise = videoRef.current.play();
          lastPlayPromiseRef.current = playPromise;
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPaused(false);
              lastPlayPromiseRef.current = null;
              
              if (!hasPlayedRef.current && onPlay) {
                onPlay();
                hasPlayedRef.current = true;
              }
            }).catch(error => {
              console.error('Error playing video:', error);
              lastPlayPromiseRef.current = null;
              
              if (error.name === 'NotAllowedError') {
                console.log('Video playback requires user interaction first');
              }
            });
          }
        } catch (error) {
          console.error('Exception during play:', error);
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isPaused, onPlay, status, videoRef]);

  // Handle auto-play functionality
  const initializeAutoPlay = useCallback(() => {
    if (status === 'ready' && autoPlay && videoRef.current && !hasPlayedRef.current) {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPaused(false);
            hasPlayedRef.current = true;
            if (onPlay) onPlay();
          }).catch(e => {
            console.log('Auto-play prevented by browser:', e);
          });
        }
      } catch (error) {
        console.error('Exception during auto-play:', error);
      }
    }
  }, [status, autoPlay, videoRef, onPlay]);

  return {
    isPaused,
    setIsPaused,
    handlePlayPause,
    initializeAutoPlay,
    hasPlayedRef
  };
}
