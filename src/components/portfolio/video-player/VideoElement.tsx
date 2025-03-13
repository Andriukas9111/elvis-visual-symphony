
import React, { useRef, useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VideoErrorData, VideoErrorType, getOptimalPreload } from './utils';
import VideoPlayerControls from './VideoPlayerControls';

interface VideoElementProps {
  videoUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onError?: (error: VideoErrorData) => void;
  poster?: string;
  isVertical?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  fileSize?: number;
}

const VideoElement: React.FC<VideoElementProps> = ({
  videoUrl,
  isPlaying,
  onTogglePlay,
  onError,
  poster,
  isVertical = false,
  muted = false,
  autoPlay = false,
  controls = true,
  loop = false,
  fileSize
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const preload = getOptimalPreload(fileSize);

  // Toggle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Video play error:', error);
          if (onError) {
            onError({
              type: VideoErrorType.PLAYBACK,
              message: 'Failed to play video',
              code: 1001,
              details: error,
              timestamp: Date.now()
            });
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, onError]);

  // Handle video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const errorCode = video.error?.code || 0;
    const errorMessage = video.error?.message || 'Unknown video error';
    
    let errorType = VideoErrorType.UNKNOWN;
    switch (errorCode) {
      case 1:
        errorType = VideoErrorType.LOAD;
        break;
      case 2:
        errorType = VideoErrorType.NETWORK;
        break;
      case 3:
        errorType = VideoErrorType.DECODE;
        break;
      case 4:
        errorType = VideoErrorType.NOT_FOUND;
        break;
      default:
        errorType = VideoErrorType.UNKNOWN;
    }
    
    if (onError) {
      onError({
        type: errorType,
        message: errorMessage,
        code: errorCode,
        details: video.error,
        timestamp: Date.now()
      });
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          preload={preload}
          muted={muted}
          autoPlay={autoPlay}
          loop={loop}
          playsInline
          className="w-full h-full object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
        />
      </AspectRatio>
      
      {controls && showControls && (
        <VideoPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          togglePlay={onTogglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
          onFullscreen={handleFullscreen}
        />
      )}
    </div>
  );
};

export default VideoElement;
