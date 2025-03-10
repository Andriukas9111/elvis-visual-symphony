
import React, { useRef, useEffect, useState, useCallback } from 'react';
import VideoPlayerControls from './VideoPlayerControls';
import VideoContent from './VideoContent';
import { isYouTubeUrl, VideoErrorType } from './utils';

interface VideoPlayerProps {
  videoId?: string;
  actualVideoUrl?: string;
  title?: string;
  isYoutubeShort?: boolean;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  actualVideoUrl,
  title,
  isYoutubeShort = false,
  onClose
}) => {
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        if ('pause' in videoRef.current) {
          videoRef.current.pause();
        }
        setPlaying(false);
      } else {
        setLoading(true);
        if ('play' in videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise) {
            playPromise
              .then(() => {
                setPlaying(true);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Play failed:", error);
                setPlaying(false);
                setLoading(false);
                setError("Failed to play video");
              });
          } else {
            setPlaying(true);
            setLoading(false);
          }
        } else {
          setPlaying(true);
          setLoading(false);
        }
      }
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const skipBackward = (seconds = 10) => {
    if (videoRef.current && 'currentTime' in videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const skipForward = (seconds = 10) => {
    if (videoRef.current && 'currentTime' in videoRef.current && 'duration' in videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && 'currentTime' in videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgress = () => {
    // This would typically update buffered status but is simplified here
  };

  const handleVideoError = useCallback((errorMessage: string) => {
    console.error("Video error:", errorMessage);
    setError(errorMessage);
    setPlaying(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (error) {
      console.error("Video player error:", error);
    }
  }, [error]);

  return (
    <div className="relative overflow-hidden w-full h-full bg-black">
      <VideoContent 
        isVisible={true}
        togglePlay={togglePlay}
        children={<div>Video content placeholder</div>}
      />

      <VideoPlayerControls
        playing={playing}
        togglePlay={togglePlay}
        fullscreen={fullscreen}
        toggleFullscreen={toggleFullscreen}
        skipBackward={() => skipBackward()}
        skipForward={() => skipForward()}
        closeVideo={onClose}
        duration={duration}
        currentTime={currentTime}
        muted={isMuted}
      />
    </div>
  );
};

export default VideoPlayer;
