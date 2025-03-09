
import React from 'react';

interface VideoIframeProps {
  videoId: string;
  title: string;
  isYoutubeEmbed?: boolean;
  isShort?: boolean;
}

const VideoIframe = React.forwardRef<HTMLIFrameElement, VideoIframeProps>((
  { videoId, title, isYoutubeEmbed = true, isShort = false },
  ref
) => {
  // If it's a YouTube embed, create the standard YouTube embed URL
  if (isYoutubeEmbed) {
    // For YouTube Shorts, we use different parameters to optimize the player
    const embedParams = isShort
      ? 'autoplay=1&rel=0&controls=1&fs=1&modestbranding=1&playsinline=1&loop=1'
      : 'autoplay=1&rel=0&controls=1&fs=1';
    
    const embedClass = isShort 
      ? "absolute inset-0 w-full h-full scale-[1.78]" // Scale up for vertical videos (9:16 aspect ratio)
      : "absolute inset-0 w-full h-full";
      
    return (
      <iframe
        ref={ref}
        className={embedClass}
        src={`https://www.youtube.com/embed/${videoId}?${embedParams}`}
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
