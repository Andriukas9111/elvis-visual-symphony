
import React, { useEffect, useState } from 'react';
import VideoIframe from './VideoIframe';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadedData = () => {
    console.log("Video loaded successfully:", actualVideoUrl);
    setIsLoading(false);
  };

  const handleError = () => {
    console.error("Error loading video:", actualVideoUrl);
    setIsLoading(false);
    setHasError(true);
    handleVideoError("Failed to load video");
  };

  // Reset states when URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [actualVideoUrl, videoId]);

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
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={handleLoadedData}
          onError={handleError}
          controls
          playsInline
        >
          <source src={actualVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
              <p className="text-white/70 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker">
            <p className="text-white/70">Failed to load video</p>
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
