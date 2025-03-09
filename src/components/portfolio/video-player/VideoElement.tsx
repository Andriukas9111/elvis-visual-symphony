
import React from 'react';

export interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ src, poster, autoPlay = false, controls = true, className = '', onPlay, onPause, onEnded }, ref) => {
    return (
      <video
        ref={ref}
        src={src}
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
