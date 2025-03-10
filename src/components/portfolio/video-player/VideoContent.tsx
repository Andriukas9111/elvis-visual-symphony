
import React, { useEffect } from 'react';
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
  // Enhanced debugging for video content
  useEffect(() => {
    console.log("VideoContent effect running:", {
      videoId,
      actualVideoUrl,
      hasDirectVideoUrl: !!actualVideoUrl,
      isYoutubeVideo: !!videoId
    });
  }, [videoId, actualVideoUrl]);

  if (videoId) {
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
    return (
      <VideoElement
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        videoUrl={actualVideoUrl}
        onVideoError={handleVideoError}
      />
    );
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
      <p className="text-white/70">No video source available</p>
    </div>
  );
};

export default VideoContent;
