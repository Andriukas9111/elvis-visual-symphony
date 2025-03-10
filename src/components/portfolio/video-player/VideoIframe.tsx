
import React, { forwardRef } from 'react';

export interface VideoIframeProps {
  videoId: string;
  title: string;
  playing?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  isYoutubeShort?: boolean;
  startAt?: number;
  videoRef?: React.MutableRefObject<HTMLIFrameElement | null>;
  className?: string;
}

const VideoIframe: React.FC<VideoIframeProps> = ({
  videoId,
  title,
  playing = false,
  muted = false,
  loop = false,
  controls = true,
  isYoutubeShort = false,
  startAt = 0,
  videoRef,
  className = ''
}) => {
  // Build YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? '1' : '0'}&mute=${muted ? '1' : '0'}&controls=${controls ? '1' : '0'}&loop=${loop ? '1' : '0'}&rel=0${startAt ? `&start=${startAt}` : ''}`;
  
  return (
    <iframe
      ref={videoRef}
      src={embedUrl}
      title={title}
      className={`absolute inset-0 w-full h-full ${className}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoIframe;
