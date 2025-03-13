
import { useState, useRef, useEffect, useCallback } from 'react';
import { useBufferState, UseBufferStateProps } from './useBufferState';

interface UseVideoControlsProps {
  initialVolume?: number;
  initialMuted?: boolean;
  onTimeUpdate?: (time: number) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const useVideoControls = (props: UseVideoControlsProps = {}) => {
  const {
    initialVolume = 0.7,
    initialMuted = false,
    onTimeUpdate,
    videoRef: externalVideoRef
  } = props;
  
  // Use provided ref or create a new one
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video buffer state
  const bufferStateProps: UseBufferStateProps = {
    onError: (error) => {
      console.error('Video playback error:', error);
    }
  };
  
  const { 
    isBuffering, 
    bufferProgress,
    handleWaiting,
    handleCanPlay,
    handleVideoError
  } = useBufferState(bufferStateProps);

  // Play/pause control
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => {
        console.error('Error playing video:', err);
      });
    } else {
      video.pause();
    }
    setIsPlaying(!video.paused);
  }, [videoRef]);

  // Volume control
  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    setVolume(newVolume);
    video.volume = newVolume;
    
    // If setting volume above 0, make sure it's not muted
    if (newVolume > 0 && video.muted) {
      setIsMuted(false);
      video.muted = false;
    }
  }, [videoRef]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !video.muted;
    setIsMuted(newMutedState);
    video.muted = newMutedState;
  }, [videoRef]);

  // Seek to specific time
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  }, [videoRef]);

  // Handle time updates
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setCurrentTime(video.currentTime);
    if (onTimeUpdate) {
      onTimeUpdate(video.currentTime);
    }
  }, [videoRef, onTimeUpdate]);

  // Handle loaded metadata (get duration)
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setDuration(video.duration);
  }, [videoRef]);

  // Setup event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Set initial values
    video.volume = volume;
    video.muted = isMuted;
    
    // Add event listeners
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleVideoError);
    
    return () => {
      // Clean up event listeners
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleVideoError);
    };
  }, [
    videoRef, 
    volume, 
    isMuted, 
    handleTimeUpdate, 
    handleLoadedMetadata, 
    handleWaiting, 
    handleCanPlay, 
    handleVideoError
  ]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!document.fullscreenElement) {
      video.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }, [videoRef]);

  return {
    videoRef,
    isPlaying,
    togglePlay,
    volume,
    handleVolumeChange,
    isMuted,
    toggleMute,
    currentTime,
    duration,
    seekTo,
    isFullscreen,
    toggleFullscreen,
    isBuffering,
    bufferProgress
  };
};
