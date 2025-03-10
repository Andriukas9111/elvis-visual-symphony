
import React, { useEffect, useRef } from 'react';

interface SelfHostedPlayerProps {
  videoUrl: string;
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
  fileSize?: number;
  onError?: (error: any) => void;
}

export const SelfHostedPlayer: React.FC<SelfHostedPlayerProps> = ({
  videoUrl,
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
  fileSize,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Sync video state with props
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Sync play/pause state
    if (isPlaying) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
          setIsPlaying(false);
          if (onError) onError({ message: 'Failed to play video', details: error });
        });
      }
    } else {
      videoElement.pause();
    }
  }, [isPlaying, setIsPlaying, onError]);
  
  // Sync volume and mute state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.volume = volume;
    videoElement.muted = isMuted;
  }, [volume, isMuted]);
  
  // Sync current time from external control
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Only update if the difference is significant to avoid loops
    if (Math.abs(videoElement.currentTime - currentTime) > 0.5) {
      videoElement.currentTime = currentTime;
    }
  }, [currentTime]);
  
  // Sync loop state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.loop = loop;
  }, [loop]);
  
  // Handle events
  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setCurrentTime(videoElement.currentTime);
    
    // Update buffered time
    if (videoElement.buffered.length > 0) {
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      setBufferedTime(bufferedEnd);
    }
  };
  
  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setDuration(videoElement.duration);
    console.log(`Loaded video: ${title}, duration: ${videoElement.duration}s`);
  };
  
  const handlePlayState = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setIsPlaying(!videoElement.paused);
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget;
    console.error('Video playback error:', videoElement.error);
    
    let errorMessage = 'An error occurred during playback';
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case 1:
          errorMessage = 'Video loading aborted';
          break;
        case 2:
          errorMessage = 'Network error occurred while loading video';
          break;
        case 3:
          errorMessage = 'Error decoding video';
          break;
        case 4:
          errorMessage = 'Video format not supported';
          break;
      }
    }
    
    if (onError) {
      onError({
        message: errorMessage,
        code: videoElement.error?.code,
        details: videoElement.error
      });
    }
  };
  
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      poster={thumbnail}
      preload="metadata"
      className="w-full h-full object-contain"
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onPlay={handlePlayState}
      onPause={handlePlayState}
      onEnded={handlePlayState}
      onError={handleVideoError}
      playsInline
    />
  );
};
