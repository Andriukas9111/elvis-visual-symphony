
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
    nextChunkRef,
    chunkUrls,
    currentChunk,
    isPaused,
    preBufferedRef
  );
  
  // Handle chunk transitions
  useChunkTransitions(
    videoRef,
    nextChunkRef,
    chunkUrls,
    currentChunk,
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
