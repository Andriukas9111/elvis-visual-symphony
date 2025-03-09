
import React from 'react';

interface VideoIframeProps {
  videoId: string;
  title: string;
  ref: React.RefObject<HTMLIFrameElement>;
}

const VideoIframe: React.FC<VideoIframeProps> = React.forwardRef<HTMLIFrameElement, Omit<VideoIframeProps, 'ref'>>((
  { videoId, title },
  ref
) => {
  return (
    <iframe
      ref={ref}
      className="absolute inset-0 w-full h-full"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&fs=1`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
});

VideoIframe.displayName = 'VideoIframe';

export default VideoIframe;
