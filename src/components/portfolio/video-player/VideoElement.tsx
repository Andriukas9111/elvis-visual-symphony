
import React, { useRef, useEffect, useState } from 'react';
import { createVideoErrorData, getOptimalPreload } from './utils';

interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  fileSize?: number;
  className?: string;
  onLoadStart?: () => void;
  onLoadedMetadata?: () => void;
  onCanPlay?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Event) => void;
  onProgress?: (percent: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  initialVolume?: number;
  playsInline?: boolean;
}

const VideoElement: React.FC<VideoElementProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  preload = 'metadata',
  fileSize,
  className = '',
  onLoadStart,
  onLoadedMetadata,
  onCanPlay,
  onPlay,
  onPause,
  onEnded,
  onError,
  onProgress,
  onTimeUpdate,
  onVolumeChange,
  initialVolume = 0.7,
  playsInline = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  
  // Determine optimal preload strategy based on file size
  const effectivePreload = fileSize ? getOptimalPreload(fileSize) : preload;
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Event handlers
    const handleLoadStart = () => onLoadStart?.();
    const handleLoadedMetadata = () => onLoadedMetadata?.();
    const handleCanPlay = () => onCanPlay?.();
    const handlePlay = () => {
      setHasAttemptedPlay(true);
      onPlay?.();
    };
    const handlePause = () => onPause?.();
    const handleEnded = () => onEnded?.();
    const handleError = (e: Event) => onError?.(e);
    
    const handleProgress = () => {
      if (!videoElement) return;
      
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
        const duration = videoElement.duration;
        const percent = (bufferedEnd / duration) * 100;
        onProgress?.(percent);
      }
    };
    
    const handleTimeUpdate = () => {
      if (!videoElement) return;
      onTimeUpdate?.(videoElement.currentTime, videoElement.duration);
    };
    
    const handleVolumeChange = () => {
      if (!videoElement) return;
      onVolumeChange?.(videoElement.volume, videoElement.muted);
    };

    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('progress', handleProgress);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('volumechange', handleVolumeChange);

    // Set initial volume
    if (typeof initialVolume === 'number' && !videoElement.muted) {
      videoElement.volume = Math.min(Math.max(initialVolume, 0), 1);
    }

    // Attempt autoplay if specified
    if (autoPlay && !hasAttemptedPlay) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Autoplay prevented:', error);
          // Fallback: try muted autoplay which is usually allowed
          if (!muted) {
            videoElement.muted = true;
            videoElement.play().catch(err => {
              console.error('Even muted autoplay failed:', err);
            });
          }
        });
      }
    }

    // Cleanup
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('progress', handleProgress);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [
    src, 
    autoPlay, 
    onLoadStart, 
    onLoadedMetadata, 
    onCanPlay, 
    onPlay, 
    onPause, 
    onEnded, 
    onError, 
    onProgress, 
    onTimeUpdate, 
    onVolumeChange, 
    initialVolume,
    muted,
    hasAttemptedPlay
  ]);

  // Update video source if it changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (videoElement.src !== src) {
      videoElement.load();
      
      // Reset play state for new source
      setHasAttemptedPlay(false);
      
      // Attempt autoplay again with new source if needed
      if (autoPlay) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Autoplay prevented with new source:', error);
            if (!muted) {
              videoElement.muted = true;
              videoElement.play().catch(err => {
                console.error('Even muted autoplay failed with new source:', err);
              });
            }
          });
        }
      }
    }
  }, [src, autoPlay, muted]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      preload={effectivePreload}
      className={className}
      playsInline={playsInline}
    />
  );
};

export default VideoElement;
