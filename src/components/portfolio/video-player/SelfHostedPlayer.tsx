
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Loader2 } from 'lucide-react';
import VideoContent from './VideoContent';
import VideoPlayerControls from './VideoPlayerControls';
import { VideoErrorData, VideoErrorType } from './utils';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import VideoThumbnail from './VideoThumbnail';

interface SelfHostedPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  fileSize?: number;
  onError?: (error: VideoErrorData) => void;
  controls?: boolean;
  muted?: boolean;
  initialVolume?: number;
}

const SelfHostedPlayer: React.FC<SelfHostedPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  hideOverlayText = true,
  loop = false,
  autoPlay = false,
  preload = 'metadata',
  fileSize,
  onError,
  controls = true,
  muted = false,
  initialVolume = 0.7
}) => {
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { prefersReducedMotion } = useAnimation();

  const handlePlay = () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsPaused(false);

    if (onPlay) {
      onPlay();
    }

    const playPromise = videoRef.current?.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsLoading(false);
      }).catch(error => {
        console.error("Playback failed:", error);
        setIsLoading(false);
        setIsPaused(true);
      });
    } else {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPaused(true);
  };

  const handlePlayToggle = () => {
    if (isPaused) {
      handlePlay();
    } else {
      handlePause();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (value: number) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgress = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (video.buffered.length > 0) {
      const lastBufferedTime = video.buffered.end(video.buffered.length - 1);
      const progress = lastBufferedTime / video.duration;
      setBufferedProgress(progress);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVideoError = useCallback((event: any) => {
    console.error("Video error:", event);
    setHasError(true);
    setIsLoading(false);
    setIsPaused(true);

    const errorDetails = {
      type: VideoErrorType.MEDIA,
      message: `Media error: ${event.message || 'Unknown error'}`,
      details: event,
      code: event.target?.error?.code,
      timestamp: Date.now()
    };

    if (onError) {
      onError(errorDetails);
    }
  }, [onError]);

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
  }, [autoPlay]);

  useEffect(() => {
    setIsMuted(muted);
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker`}
      data-testid="self-hosted-player"
    >
      {!isPaused && !isLoading && (
        <VideoThumbnail
          thumbnail={thumbnail}
          title={title}
          isVertical={isVertical}
          togglePlay={handlePlayToggle}
        />
      )}
      
      <VideoContent 
        isVisible={!isPaused}
        togglePlay={handlePlayToggle}
      >
        <motion.video
          ref={videoRef}
          src={videoUrl}
          loop={loop}
          muted={isMuted}
          preload={preload}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="video-element"
          style={{
            pointerEvents: 'none'
          }}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onProgress={handleProgress}
          onError={handleVideoError}
        />
      </VideoContent>
      
      {controls && (
        <VideoPlayerControls
          playing={!isPaused}
          togglePlay={handlePlayToggle}
          loading={isLoading}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          muted={isMuted}
          bufferProgress={bufferedProgress}
          onPlayPause={handlePlayToggle}
          onMute={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          title={title}
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <motion.div 
            className="rounded-full bg-elvis-pink/90 p-4 shadow-lg shadow-elvis-pink/30"
            animate={{ scale: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="text-white text-center">
            <p>An error occurred while loading the video.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfHostedPlayer;
