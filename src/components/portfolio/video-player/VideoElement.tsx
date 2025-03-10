
import React, { forwardRef } from 'react';
import { VideoErrorType, VideoErrorData, getOptimalPreload } from './utils';

export interface VideoElementProps {
  actualVideoUrl: string; 
  playing?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  fileSize?: number;
  onError?: (error: VideoErrorData) => void;
  handleTimeUpdate?: () => void;
  handleProgress?: () => void;
  videoRef?: React.MutableRefObject<HTMLVideoElement | null>;
  className?: string;
}

const VideoElement: React.FC<VideoElementProps> = ({
  actualVideoUrl,
  playing = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  fileSize,
  onError,
  handleTimeUpdate,
  handleProgress,
  videoRef,
  className = ''
}) => {
  const effectivePreload = getOptimalPreload(fileSize, preload);
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Video element error:', e);
    if (onError) {
      const videoEl = e.target as HTMLVideoElement;
      const error: VideoErrorData = {
        type: VideoErrorType.MEDIA,
        message: `Video playback error: ${videoEl.error?.message || 'Unknown error'}`,
        code: videoEl.error?.code,
        timestamp: Date.now()
      };
      onError(error);
    }
  };
  
  return (
    <video
      ref={videoRef}
      src={actualVideoUrl}
      autoPlay={playing}
      muted={muted}
      loop={loop}
      preload={effectivePreload}
      className={`w-full h-full object-cover ${className}`}
      playsInline
      onTimeUpdate={handleTimeUpdate}
      onProgress={handleProgress}
      onError={handleError}
    />
  );
};

export default VideoElement;
