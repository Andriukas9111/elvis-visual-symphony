
import React, { useEffect, useRef } from 'react';

interface VideoElementProps {
  videoUrl: string;
  onVideoError?: (error: string) => void;
  onLoadedMetadata?: () => void;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>((
  { videoUrl, onVideoError, onLoadedMetadata },
  ref
) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  
  // Combine the forwarded ref with our local ref
  React.useImperativeHandle(ref, () => internalVideoRef.current!);
  
  useEffect(() => {
    console.log("VideoElement mounting with URL:", videoUrl);
    
    const videoElement = internalVideoRef.current;
    if (!videoElement) return;
    
    // Set up event listeners for debugging
    const handleCanPlay = () => console.log("Video can play:", videoUrl);
    const handleLoadedData = () => console.log("Video loaded data:", videoUrl);
    const handleLoadedMetadata = () => {
      console.log("Video loaded metadata:", videoUrl);
      if (onLoadedMetadata) onLoadedMetadata();
    };
    
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Try to load the video when the component mounts or URL changes
    try {
      videoElement.load();
    } catch (error) {
      console.error("Error loading video:", error);
    }
    
    // Cleanup function
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      
      try {
        videoElement.pause();
        videoElement.src = '';
        videoElement.load();
      } catch (err) {
        console.error("Error cleaning up video element:", err);
      }
    };
  }, [videoUrl, onLoadedMetadata]);
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const error = target.error;
    
    let errorMessage = "Unknown video playback error";
    if (error) {
      // Map error codes to more descriptive messages
      switch (error.code) {
        case 1:
          errorMessage = `Video loading aborted (MEDIA_ERR_ABORTED): ${error.message}`;
          break;
        case 2:
          errorMessage = `Network error while loading video (MEDIA_ERR_NETWORK): ${error.message}`;
          break;
        case 3:
          errorMessage = `Video decoding failed (MEDIA_ERR_DECODE): ${error.message}`;
          break;
        case 4:
          errorMessage = `Video format not supported (MEDIA_ERR_SRC_NOT_SUPPORTED): ${error.message}`;
          break;
        default:
          errorMessage = `Video playback error (${error.code}): ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    console.error("Video source was:", videoUrl);
    
    if (onVideoError) {
      onVideoError(errorMessage);
    }
  };

  return (
    <video
      ref={internalVideoRef}
      className="absolute inset-0 w-full h-full object-cover"
      preload="auto"
      playsInline
      controls
      onError={handleError}
      controlsList="nodownload"
      crossOrigin="anonymous"
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
