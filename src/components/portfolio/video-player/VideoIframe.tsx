
import React from 'react';

export interface VideoIframeProps {
  src: string;
  title: string;
  allow?: string;
  className?: string;
  allowFullScreen?: boolean;
}

const VideoIframe = React.forwardRef<HTMLIFrameElement, VideoIframeProps>(
  ({ 
    src, 
    title, 
    allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", 
    className = '', 
    allowFullScreen = true 
  }, ref) => {
    return (
      <iframe
        ref={ref}
        src={src}
        title={title}
        allow={allow}
        className={className}
        allowFullScreen={allowFullScreen}
      />
    );
  }
);

VideoIframe.displayName = 'VideoIframe';

export default VideoIframe;
