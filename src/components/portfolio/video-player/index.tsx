import React, { useRef, useEffect, useState, useCallback, MutableRefObject } from 'react';
import VideoPlayerControls from './VideoPlayerControls';
import { useVideoPlayer } from './useVideoPlayer';
import VideoContent from './VideoContent';
import VideoElement from './VideoElement';
import VideoIframe from './VideoIframe';
import { isYouTubeUrl, VideoErrorType } from './utils';

interface VideoPlayerProps {
  videoId?: string;
  actualVideoUrl?: string;
  title?: string;
  isYoutubeShort?: boolean;
  onClose?: () => void;
}

// Adjust click handlers to properly handle the event parameter
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  actualVideoUrl,
  title,
  isYoutubeShort = false,
  onClose
}) => {
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    isPlaying,
    isPaused,
    isVisible,
    progress,
    duration,
    currentTime,
    buffered,
    isMuted,
    isFullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seek,
    skipBackward,
    skipForward,
    handleTimeUpdate,
    handleProgress,
  } = useVideoPlayer(videoRef);

  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const iframeProps = {
    videoId: videoId,
    title: title,
    isYoutubeShort: isYoutubeShort,
  };

  const videoElementProps = {
    actualVideoUrl: actualVideoUrl,
    handleTimeUpdate: handleTimeUpdate,
    handleProgress: handleProgress,
  };

  // Fix the event handlers to properly accept and handle the event parameter
  const handleTogglePlay = () => {
    togglePlay();
  };
  
  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };
  
  const handleSkipBackward = () => {
    skipBackward();
  };
  
  const handleSkipForward = () => {
    skipForward();
  };

  const handleVideoError = useCallback((errorMessage: string) => {
    console.error("Video error:", errorMessage);
    setError(errorMessage);
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Video player error:", error);
    }
  }, [error]);

  return (
    <div className="relative overflow-hidden w-full h-full bg-black">
      {isYouTubeUrl(actualVideoUrl || videoId || '') ? (
        <VideoIframe {...iframeProps} videoRef={videoRef as MutableRefObject<HTMLIFrameElement>} />
      ) : (
        <VideoElement {...videoElementProps} videoRef={videoRef as MutableRefObject<HTMLVideoElement>} />
      )}
      
      {/* Pass the fixed handlers to VideoContent */}
      <VideoContent 
        isVisible={isVisible}
        togglePlay={handleTogglePlay}
        videoId={videoId}
        actualVideoUrl={actualVideoUrl}
        title={title}
        isYoutubeShort={isYoutubeShort}
        videoRef={videoRef}
        handleVideoError={handleVideoError}
      >
        {isYouTubeUrl(actualVideoUrl || videoId || '') ? (
          <VideoIframe {...iframeProps} videoRef={videoRef as MutableRefObject<HTMLIFrameElement>} />
        ) : (
          <VideoElement {...videoElementProps} videoRef={videoRef as MutableRefObject<HTMLVideoElement>} />
        )}
      </VideoContent>

      <VideoPlayerControls
        playing={isPlaying}
        togglePlay={handleTogglePlay}
        fullscreen={isFullscreen}
        toggleFullscreen={handleToggleFullscreen}
        skipBackward={handleSkipBackward}
        skipForward={handleSkipForward}
        closeVideo={onClose}
        duration={duration}
        currentTime={currentTime}
        muted={isMuted}
      />
    </div>
  );
};

export default VideoPlayer;
