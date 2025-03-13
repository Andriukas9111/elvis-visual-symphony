
import React, { useRef, useEffect, useState } from 'react';
import { VideoErrorData, VideoErrorType, getOptimalPreload } from '@/components/portfolio/video-player/utils';
import VideoPlayerControls from './VideoPlayerControls';

interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  fileSize?: number;
  onError?: (error: VideoErrorData) => void;
  customControls?: boolean;
  onTimeUpdate?: (time: number) => void;
}

const VideoElement: React.FC<VideoElementProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  width = '100%',
  height = 'auto',
  className = '',
  fileSize,
  onError,
  customControls = false,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCustomControls, setShowCustomControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Set the preload strategy based on file size
  const preload = getOptimalPreload(fileSize);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleError = (e: Event) => {
      const videoEl = e.target as HTMLVideoElement;
      const errorData: VideoErrorData = {
        type: VideoErrorType.UNKNOWN,
        message: 'An unknown error occurred',
        timestamp: Date.now()
      };
      
      if (videoEl.error) {
        // Map MediaError codes to our error types
        switch (videoEl.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorData.type = VideoErrorType.PLAYBACK;
            errorData.message = 'Playback aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorData.type = VideoErrorType.NETWORK;
            errorData.message = 'Network error';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorData.type = VideoErrorType.DECODE;
            errorData.message = 'Media decode error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorData.type = VideoErrorType.FORMAT;
            errorData.message = 'Format not supported';
            break;
        }
        errorData.code = videoEl.error.code;
      }
      
      if (onError) {
        onError(errorData);
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onError, onTimeUpdate]);
  
  // Update playing state when video plays or pauses
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(err => console.error('Error playing video:', err));
    } else {
      video.pause();
    }
  };
  
  return (
    <div className={`relative ${className}`} style={{ width, height: height === 'auto' ? 'auto' : height }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls && !customControls}
        preload={preload}
        className={`w-full h-full object-contain ${customControls ? 'cursor-pointer' : ''}`}
        onClick={customControls ? togglePlay : undefined}
        onMouseEnter={() => customControls && setShowCustomControls(true)}
        onMouseLeave={() => customControls && setShowCustomControls(false)}
      />
      
      {customControls && showCustomControls && (
        <VideoPlayerControls
          videoRef={videoRef}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          togglePlay={togglePlay}
        />
      )}
    </div>
  );
};

export default VideoElement;
