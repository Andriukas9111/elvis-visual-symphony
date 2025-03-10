
import { useState, useEffect, RefObject, useRef } from 'react';
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
  const [currentChunk, setCurrentChunk] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(muted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const hasPlayedRef = useRef<boolean>(false);

  const handlePlayPause = () => {
    if (status !== 'ready') return;
    
    if (isPaused) {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPaused(false);
            if (!hasPlayedRef.current && onPlay) {
              onPlay();
              hasPlayedRef.current = true;
            }
          }).catch(error => {
            console.error('Error playing video:', error);
            if (error.name === 'NotAllowedError') {
              console.log('Video playback requires user interaction first');
            }
          });
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, value));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleChunkEnded = () => {
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
  };

  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', event);
    
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
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handleCanPlay = () => {
    setIsBuffering(false);
  };
  
  // Effect for handling autoplay
  useEffect(() => {
    if (status === 'ready' && autoPlay && videoRef.current && !hasPlayedRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPaused(false);
          hasPlayedRef.current = true;
        }).catch(e => {
          console.log('Auto-play prevented by browser:', e);
        });
      }
    }
  }, [status, autoPlay, videoRef, hasPlayedRef]);

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
