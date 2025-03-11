
import { useState, useRef, useEffect } from 'react';
import { UseChunkedVideoProps, UseChunkedVideoResult } from './types';
import { useVideoFetching } from './useVideoFetching';
import { useVideoControls } from './useVideoControls';

/**
 * Hook for playing chunked videos with seamless transitions
 */
export function useChunkedVideo({
  videoId,
  onError,
  autoPlay = false,
  muted = false,
  loop = false,
  initialVolume = 0.7,
  onPlay
}: UseChunkedVideoProps): UseChunkedVideoResult {
  // Refs for video elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextChunkRef = useRef<HTMLVideoElement>(null);
  const preBufferedRef = useRef<boolean>(false);

  // Get video data and chunks
  const {
    status,
    errorMessage,
    chunkData,
    chunkUrls,
    loadingProgress
  } = useVideoFetching(videoId, onError);

  // Initialize video controls with the retrieved chunk data
  const {
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

  return {
    videoRef,
    nextChunkRef,
    status,
    errorMessage,
    chunkUrls,
    currentChunk,
    isPaused,
    volume,
    isMuted,
    duration,
    currentTime,
    loadingProgress,
    isBuffering,
    chunkData,
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
