
import React, { useRef, useEffect, forwardRef } from 'react';
import { VideoErrorType, VideoErrorData } from './utils';
import { getOptimalPreload } from './utils';

interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  onError?: (error: VideoErrorData) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  fileSize?: number;
}

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ 
    src, 
    poster, 
    autoPlay = false, 
    muted = true, 
    loop = false, 
    controls = true, 
    className = '', 
    onError, 
    onPlay, 
    onPause, 
    onEnded, 
    onTimeUpdate, 
    onLoadedMetadata,
    fileSize
  }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const innerRef = ref || videoRef;
    
    // Handle video errors
    const handleError = () => {
      if (!onError || !(innerRef as React.RefObject<HTMLVideoElement>).current) return;
      
      const video = (innerRef as React.RefObject<HTMLVideoElement>).current!;
      const errorData: VideoErrorData = {
        type: VideoErrorType.UNKNOWN,
        message: 'Unknown video error',
        timestamp: Date.now()
      };
      
      // Map HTML5 video error codes to our custom error types
      if (video.error) {
        switch(video.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorData.type = VideoErrorType.PLAYBACK;
            errorData.message = 'Video playback was aborted';
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorData.type = VideoErrorType.NETWORK;
            errorData.message = 'Network error occurred while loading the video';
            break;
          case 3: // MEDIA_ERR_DECODE
            errorData.type = VideoErrorType.DECODE;
            errorData.message = 'Video decoding failed';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorData.type = VideoErrorType.FORMAT;
            errorData.message = 'Video format not supported';
            break;
        }
        
        errorData.code = video.error.code;
        errorData.details = video.error.message;
      }
      
      onError(errorData);
    };
    
    // Set up event listeners
    useEffect(() => {
      const video = (innerRef as React.RefObject<HTMLVideoElement>).current;
      if (!video) return;
      
      // Time update handler
      const handleTimeUpdate = () => {
        if (onTimeUpdate) onTimeUpdate(video.currentTime);
      };
      
      // Metadata loaded handler
      const handleLoadedMetadata = () => {
        if (onLoadedMetadata) onLoadedMetadata(video.duration);
      };
      
      // Set up event listeners
      video.addEventListener('error', handleError);
      video.addEventListener('play', onPlay || (() => {}));
      video.addEventListener('pause', onPause || (() => {}));
      video.addEventListener('ended', onEnded || (() => {}));
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Cleanup
      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('play', onPlay || (() => {}));
        video.removeEventListener('pause', onPause || (() => {}));
        video.removeEventListener('ended', onEnded || (() => {}));
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }, [innerRef, onError, onPlay, onPause, onEnded, onTimeUpdate, onLoadedMetadata]);
    
    // Determine preload strategy based on file size
    const preload = getOptimalPreload(fileSize);
    
    return (
      <video
        ref={innerRef}
        src={src}
        poster={poster}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload={preload}
        onError={handleError}
      />
    );
  }
);

VideoElement.displayName = 'VideoElement';

export default VideoElement;
