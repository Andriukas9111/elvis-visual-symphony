
import { useState, useEffect, RefObject, useRef, useCallback } from 'react';
import { VideoErrorType } from '@/components/portfolio/video-player/utils';
import { UseChunkedVideoProps } from './types';

export function useVideoControls(
  videoRef: RefObject<HTMLVideoElement>,
  status: 'loading' | 'buffering' | 'ready' | 'error',
  autoPlay: boolean,
  muted: boolean,
  loop: boolean,
  initialVolume: number,
  onPlay: (() => void) | undefined,
  chunkUrls: string[],
  onError: UseChunkedVideoProps['onError'],
  preBufferedRef: React.MutableRefObject<boolean>
) {
  // Video state
  const [currentChunk, setCurrentChunk] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(muted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Refs for tracking state across renders
  const hasPlayedRef = useRef<boolean>(false);
  const lastPlayPromiseRef = useRef<Promise<void> | null>(null);

  // Handle play/pause
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

  // Volume control
  const handleVolumeChange = useCallback((value: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, value));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, [videoRef]);

  // Mute toggle
  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted, videoRef]);

  // Time update handler
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [videoRef]);

  // Seek to specific time
  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, [videoRef]);

  // Metadata loaded handler
  const handleMetadataLoaded = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // Set volume and muted state when metadata loads
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [videoRef, volume, isMuted]);

  // Chunk ended handler
  const handleChunkEnded = useCallback(() => {
    if (currentChunk < chunkUrls.length - 1) {
      setCurrentChunk(prev => prev + 1);
      setIsBuffering(true);
      preBufferedRef.current = false;
    } else if (loop) {
      setCurrentChunk(0);
      preBufferedRef.current = false;
    } else {
      setIsPaused(true);
    }
  }, [currentChunk, chunkUrls.length, loop, preBufferedRef]);

  // Video error handler
  const handleVideoError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video playback error:', event);
    
    const videoElement = event.currentTarget;
    const errorCode = videoElement.error?.code;
    const errorMessage = videoElement.error?.message || 'Unknown video error';
    
    if (onError) {
      onError({
        type: VideoErrorType.MEDIA,
        message: errorMessage,
        code: errorCode,
        timestamp: Date.now()
      });
    }
  }, [onError]);

  // Buffering handlers
  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);
  
  // Effect for auto-play
  useEffect(() => {
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

  // Effect to sync muted state with prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      setIsMuted(muted);
    }
  }, [muted, videoRef]);

  // Effect to sync volume with prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = initialVolume;
      setVolume(initialVolume);
    }
  }, [initialVolume, videoRef]);

  return {
    currentChunk,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    isBuffering,
    setCurrentChunk,
    handlePlayPause,
    handleVolumeChange,
    handleMuteToggle,
    handleTimeUpdate,
    handleSeek,
    handleMetadataLoaded,
    handleChunkEnded,
    handleVideoError,
    handleWaiting,
    handleCanPlay
  };
}
