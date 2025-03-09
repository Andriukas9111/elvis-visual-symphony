
import React from 'react';

export interface VideoElementProps {
  src?: string;
  videoUrl?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ 
    src, 
    videoUrl,
    poster, 
    autoPlay = false, 
    controls = true, 
    className = '', 
    onPlay, 
    onPause, 
    onEnded 
  }, ref) => {
    // Use videoUrl if provided, otherwise fall back to src
    const videoSrc = videoUrl || src;
    
    return (
      <video
        ref={ref}
        src={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        className={className}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        playsInline
      />
    );
  }
);

VideoElement.displayName = 'VideoElement';

export default VideoElement;
