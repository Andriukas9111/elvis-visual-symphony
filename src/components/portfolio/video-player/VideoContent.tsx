
import React, { useEffect, useState } from 'react';
import VideoIframe from './VideoIframe';
import VideoElement from './VideoElement';

interface VideoContentProps {
  videoId: string | null;
  actualVideoUrl: string;
  title: string;
  isYoutubeShort: boolean;
  videoRef: React.RefObject<HTMLIFrameElement | HTMLVideoElement>;
  handleVideoError: (error: string) => void;
}

const VideoContent: React.FC<VideoContentProps> = ({
  videoId,
  actualVideoUrl,
  title,
  isYoutubeShort,
  videoRef,
  handleVideoError
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Enhanced debugging for video content
  useEffect(() => {
    console.log("VideoContent effect running:", {
      videoId,
      actualVideoUrl,
      hasDirectVideoUrl: !!actualVideoUrl,
      isYoutubeVideo: !!videoId
    });
  }, [videoId, actualVideoUrl]);

  const handleVideoLoaded = () => {
    console.log("Video metadata loaded for:", actualVideoUrl);
    setVideoLoaded(true);
  };

  if (videoId) {
    // YouTube video handling
    return (
      <VideoIframe
        ref={videoRef as React.RefObject<HTMLIFrameElement>}
        videoId={videoId}
        title={title}
        isShort={isYoutubeShort}
      />
    );
  } 
  
  if (actualVideoUrl) {
    console.log("Rendering VideoElement with URL:", actualVideoUrl);
    // Self-hosted video handling
    return (
      <div className="relative w-full h-full">
        <VideoElement
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          videoUrl={actualVideoUrl}
          onVideoError={handleVideoError}
          onLoadedMetadata={handleVideoLoaded}
        />
        
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-elvis-pink border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-white/70 text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
      <p className="text-white/70">No video source available</p>
    </div>
  );
};

export default VideoContent;
