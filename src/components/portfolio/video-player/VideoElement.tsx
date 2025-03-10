
import React, { useEffect, useRef } from 'react';

interface VideoElementProps {
  videoUrl: string;
  onVideoError?: (error: string) => void;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>((
  { videoUrl, onVideoError },
  ref
) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Combine the forwarded ref with our local ref
  React.useImperativeHandle(ref, () => videoRef.current!);
  
  useEffect(() => {
    console.log("VideoElement mounting with URL:", videoUrl);
    
    // Try to load the video when the component mounts or URL changes
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, [videoUrl]);
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const error = target.error;
    const errorMessage = error ? 
      `Video playback error (${error.code}): ${error.message}` : 
      'Unknown video playback error';
    
    console.error(errorMessage);
    console.error("Video source was:", videoUrl);
    
    if (onVideoError) {
      onVideoError(errorMessage);
    }
  };

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      preload="metadata"
      playsInline
      controls
      onError={handleError}
      controlsList="nodownload"
    >
      <source src={videoUrl} type="video/mp4" />
      <source src={videoUrl} type="video/webm" />
      <source src={videoUrl} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
