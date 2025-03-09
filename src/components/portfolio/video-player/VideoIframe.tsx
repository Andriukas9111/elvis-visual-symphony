
import React from 'react';

export interface VideoIframeProps {
  src?: string;
  videoId?: string;
  title: string;
  allow?: string;
  className?: string;
  allowFullScreen?: boolean;
}

const VideoIframe = React.forwardRef<HTMLIFrameElement, VideoIframeProps>(
  ({ 
    src, 
    videoId,
    title, 
    allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", 
    className = '', 
    allowFullScreen = true 
  }, ref) => {
    // If videoId is provided, construct YouTube embed URL
    const embedSrc = videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` 
      : src;
      
    return (
      <iframe
        ref={ref}
        src={embedSrc}
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
