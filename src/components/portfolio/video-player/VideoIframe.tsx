
import React from 'react';

interface VideoIframeProps {
  videoId: string;
  title: string;
  isYoutubeEmbed?: boolean;
}

const VideoIframe = React.forwardRef<HTMLIFrameElement, VideoIframeProps>((
  { videoId, title, isYoutubeEmbed = true },
  ref
) => {
  // If it's a YouTube embed, create the standard YouTube embed URL
  if (isYoutubeEmbed) {
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
  }
  
  // For non-YouTube embeds, use the URL directly
  return (
    <iframe
      ref={ref}
      className="absolute inset-0 w-full h-full"
      src={videoId}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
});

VideoIframe.displayName = 'VideoIframe';

export default VideoIframe;
