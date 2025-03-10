
import React, { useEffect, useRef } from 'react';

interface VideoElementProps {
  videoUrl: string;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>((
  { videoUrl },
  ref
) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Combine the forwarded ref with our local ref
  React.useImperativeHandle(ref, () => videoRef.current!);
  
  useEffect(() => {
    console.log("VideoElement rendering with URL:", videoUrl);
    
    // Try to load the video when the component mounts or URL changes
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video playback error:", e);
    console.error("Video source was:", videoUrl);
  };

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      src={videoUrl}
      preload="auto"
      muted={false}
      playsInline
      controls
      onError={handleError}
    />
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
