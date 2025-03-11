
import { RefObject, useRef } from 'react';
import { VideoErrorType } from '@/components/portfolio/video-player/utils';
import { UseChunkedVideoProps } from './types';
import { usePlayPause } from './usePlayPause';
import { useVolumeControl } from './useVolumeControl';
import { useTimeTracking } from './useTimeTracking';
import { useBufferState } from './useBufferState';
import { useChunkNavigation } from './useChunkNavigation';
import { useEffect } from 'react';

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
  // Initialize all our smaller hooks
  const {
    isPaused,
    setIsPaused,
    handlePlayPause,
    initializeAutoPlay,
    hasPlayedRef
  } = usePlayPause({
    videoRef,
    status,
    autoPlay,
    onPlay
  });

  const {
    volume,
    isMuted,
    handleVolumeChange,
    handleMuteToggle
  } = useVolumeControl({
    videoRef,
    initialVolume,
    muted
  });

  const {
    currentChunk,
    setCurrentChunk,
    handleChunkEnded
  } = useChunkNavigation({
    chunkUrls,
    loop,
    preBufferedRef,
    setIsBuffering: (isBuffering) => bufferStateRef.current.setIsBuffering(isBuffering),
    setIsPaused
  });

  // We need to create a ref to store buffer state functions since there's a circular dependency
  const bufferStateRef = useRef<any>({
    isBuffering: false,
    setIsBuffering: () => {},
    handleWaiting: () => {},
    handleCanPlay: () => {},
    handleVideoError: () => {}
  });

  // Initialize buffer state hook
  const bufferState = useBufferState({
    videoRef,
    currentChunk,
    chunkUrls,
    onError
  });

  // Update the ref with fresh functions
  useEffect(() => {
    bufferStateRef.current = bufferState;
  }, [bufferState]);

  const {
    isBuffering,
    handleWaiting,
    handleCanPlay,
    handleVideoError
  } = bufferState;

  const {
    duration,
    currentTime,
    handleTimeUpdate,
    handleSeek,
    handleMetadataLoaded
  } = useTimeTracking({
    videoRef
  });

  // Initialize auto-play when ready
  initializeAutoPlay();

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
