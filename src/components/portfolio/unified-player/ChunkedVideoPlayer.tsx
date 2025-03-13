
import React, { useEffect } from 'react';
import { useChunkedVideo } from '@/hooks/chunkedVideo';

interface ChunkedVideoPlayerProps {
  videoId: string;
  thumbnail: string;
  title: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  bufferedTime: number;
  setBufferedTime: (time: number) => void;
  loop?: boolean;
  onError?: (error: any) => void;
}

export const ChunkedVideoPlayer: React.FC<ChunkedVideoPlayerProps> = ({
  videoId,
  thumbnail,
  title,
  isPlaying,
  setIsPlaying,
  volume,
  isMuted,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  bufferedTime,
  setBufferedTime,
  loop = false,
  onError
}) => {
  // Use a custom hook in your implementation or use a different hook
  // and map to match the expected structure
  const hook = useChunkedVideo();
  
  // Map the hook properties for use in this component
  const {
    videoRef,
    status,
    errorMessage,
    chunkData,
    chunkUrls,
    currentChunk,
    isPaused,
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
  } = hook;
  
  // Sync player state with parent component
  useEffect(() => {
    setIsPlaying(!isPaused);
  }, [isPaused, setIsPlaying]);
  
  // Handle play/pause from parent
  useEffect(() => {
    if (isPlaying !== !isPaused) {
      handlePlayPause();
    }
  }, [isPlaying, isPaused, handlePlayPause]);
  
  // Sync volume
  useEffect(() => {
    handleVolumeChange(volume);
  }, [volume, handleVolumeChange]);
  
  // Sync mute state
  useEffect(() => {
    if (isMuted !== hook.isMuted) {
      handleMuteToggle();
    }
  }, [isMuted, hook.isMuted, handleMuteToggle]);
  
  // Update parent with current time and duration
  useEffect(() => {
    setCurrentTime(hook.currentTime);
    setDuration(hook.duration);
  }, [hook.currentTime, hook.duration, setCurrentTime, setDuration]);
  
  // Handle seeking from parent
  useEffect(() => {
    // Avoid loops by checking if the difference is significant
    if (Math.abs(currentTime - hook.currentTime) > 0.5) {
      handleSeek(currentTime);
    }
  }, [currentTime, hook.currentTime, handleSeek]);
  
  // Regularly update buffered time
  useEffect(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const buffered = videoRef.current.buffered.end(0);
      setBufferedTime(buffered);
    }
  }, [hook.currentTime, setBufferedTime, videoRef]);
  
  // Report errors to parent
  useEffect(() => {
    if (status === 'error' && errorMessage && onError) {
      onError({
        message: errorMessage,
        type: 'chunked_video_error',
        details: chunkData
      });
    }
  }, [status, errorMessage, chunkData, onError]);
  
  if (status === 'loading' || chunkUrls.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-elvis-darker">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-elvis-pink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-white/70">Loading video... {loadingProgress}%</p>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-elvis-darker">
        <div className="text-center text-red-500">
          <p>Failed to load video: {errorMessage}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full overflow-hidden">
      {/* Current chunk video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleChunkEnded}
        onLoadedMetadata={handleMetadataLoaded}
        onError={handleVideoError}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        playsInline
      >
        {chunkUrls.length > 0 && (
          <source src={chunkUrls[currentChunk]} type="video/mp4" />
        )}
      </video>
      
      {/* Loading overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-2 border-elvis-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
