import { useRef } from 'react';
import { useVideoFetching } from './useVideoFetching';
import { useVideoControls } from './useVideoControls';
import { useChunkBuffering } from './useChunkBuffering';
import { useChunkTransitions } from './useChunkTransitions';
import { UseChunkedVideoProps, UseChunkedVideoResult } from './types';

export const useChunkedVideo = ({
  videoId,
  onError,
  autoPlay = false,
  muted = false,
  loop = false,
  initialVolume = 0.7,
  onPlay
}: UseChunkedVideoProps): UseChunkedVideoResult => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextChunkRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef<boolean>(false);
  const preBufferedRef = useRef<boolean>(false);
  
  // Fetch video data and chunks
  const {
    status,
    errorMessage,
    chunkData,
    chunkUrls,
    loadingProgress
  } = useVideoFetching(videoId, onError);
  
  // Video controls
  const {
    currentChunk,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    isBuffering,
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
  } = useVideoControls(
    videoRef,
    status,
    autoPlay,
    muted,
    loop,
    initialVolume,
    onPlay,
    chunkUrls,
    onError,
    preBufferedRef
  );
  
  // Pre-buffering
  useChunkBuffering(
    videoRef,
    isPaused
  );
  
  // Handle chunk transitions
  useChunkTransitions(
    videoRef,
    chunkUrls[currentChunk] || '',
    isPaused
  );

  return {
    videoRef,
    nextChunkRef,
    status,
    errorMessage,
    chunkData,
    chunkUrls,
    currentChunk,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    loadingProgress,
    isBuffering,
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
};

// Export all hooks for potential direct use
export * from './usePlayPause';
export * from './useVolumeControl';
export * from './useTimeTracking';
export * from './useBufferState';
export * from './useChunkNavigation';
export * from './useVideoFetching';
export * from './useChunkBuffering';
export * from './useChunkTransitions';
