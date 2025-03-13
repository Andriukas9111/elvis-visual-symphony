
import { useState, useRef, useCallback } from 'react';
import { useBufferState, type BufferState } from './useBufferState';
import { VideoErrorType, VideoErrorData } from '@/components/portfolio/video-player/utils';

export interface VideoControlsState {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPaused: boolean;
  volume: number;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  isBuffering: boolean;
  bufferProgress: number;
  handlePlayPause: () => void;
  handleVolumeChange: (value: number) => void;
  handleMuteToggle: () => void;
  handleTimeUpdate: () => void;
  handleSeek: (time: number) => void;
  handleMetadataLoaded: () => void;
  handleVideoError: (error: VideoErrorData) => void;
  handleWaiting: () => void;
  handleCanPlay: () => void;
}

export const useVideoControls = (): VideoControlsState => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Get buffer state
  const bufferState: BufferState = useBufferState({
    onError: (error) => console.error('Video buffer error:', error)
  });

  // Extract buffer properties
  const {
    isBuffering,
    bufferProgress,
    handleWaiting,
    handleCanPlay,
    handleVideoError
  } = bufferState;

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPaused) {
      videoRef.current.play()
        .then(() => setIsPaused(false))
        .catch(error => {
          console.error('Error playing video:', error);
          // Create error data with timestamp
          const errorData: VideoErrorData = {
            type: VideoErrorType.PLAYBACK,
            message: 'Failed to play video',
            code: error.code,
            details: error,
            timestamp: Date.now()
          };
          handleVideoError(errorData);
        });
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused, handleVideoError]);

  const handleVolumeChange = useCallback((value: number) => {
    if (!videoRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, value));
    videoRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
    
    if (clampedVolume > 0 && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  }, [isMuted]);

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (!videoRef.current) return;
    
    const validTime = Math.max(0, Math.min(duration, time));
    videoRef.current.currentTime = validTime;
    setCurrentTime(validTime);
  }, [duration]);

  const handleMetadataLoaded = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  }, []);

  return {
    videoRef,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    isBuffering,
    bufferProgress,
    handlePlayPause,
    handleVolumeChange,
    handleMuteToggle,
    handleTimeUpdate,
    handleSeek,
    handleMetadataLoaded,
    handleVideoError,
    handleWaiting,
    handleCanPlay
  };
};
