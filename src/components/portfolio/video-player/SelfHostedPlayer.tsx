
import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface SelfHostedPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

const SelfHostedPlayer: React.FC<SelfHostedPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  hideOverlayText = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const { prefersReducedMotion } = useAnimation();

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (isLoading) return;
    
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  };

  // Play video
  const playVideo = async () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    
    try {
      // This will trigger the loading of the video
      await videoRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      
      if (onPlay) {
        onPlay();
      }
    } catch (error) {
      console.error('Error playing video:', error);
      setIsLoading(false);
      setHasError(true);
    }
  };

  // Pause video
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error('Error exiting fullscreen:', err);
        });
      } else {
        containerRef.current.requestFullscreen().catch(err => {
          console.error('Error entering fullscreen:', err);
        });
      }
    }
  };

  // Handle video loading progress
  const handleProgress = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        setLoadProgress((bufferedEnd / duration) * 100);
      }
    }
  };

  // Handle video loading events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadStart = () => {
      console.log("Video load started");
      setIsLoading(true);
      setHasError(false);
    };
    
    const handleLoadedData = () => {
      console.log("Video data loaded");
      setIsLoading(false);
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error("Video error:", e);
      setIsLoading(false);
      setHasError(true);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError as EventListener);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('progress', handleProgress);
    
    // Clean up
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError as EventListener);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('progress', handleProgress);
    };
  }, []);

  // Mute/unmute when changing playing state
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Ensure video is muted initially
    if (!isPlaying) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isPlaying]);

  // Stop playing when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker cursor-pointer group`} 
      onClick={togglePlayPause}
    >
      {/* Thumbnail overlay - shown until video plays */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg'; 
            }}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/40 transition-opacity group-hover:bg-elvis-dark/60">
            {isLoading ? (
              <motion.div 
                className="rounded-full bg-elvis-pink/90 p-4 shadow-lg shadow-elvis-pink/30"
                animate={{ scale: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-full bg-elvis-pink/90 p-4 shadow-lg shadow-elvis-pink/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Play className="w-8 h-8 text-white fill-current" />
              </motion.div>
            )}
          </div>
          
          {/* Title overlay - only if not hidden */}
          {!hideOverlayText && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium">{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`w-full h-full object-cover ${!isPlaying ? 'invisible' : 'visible'}`}
        playsInline
        muted
        preload="metadata"
        onError={() => setHasError(true)}
      />

      {/* Controls overlay - only visible when playing */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Loading progress bar */}
          {loadProgress < 100 && (
            <div className="absolute top-0 left-0 h-1 bg-elvis-pink/50" style={{ width: `${loadProgress}%` }} />
          )}
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleMute} 
              className="text-white/90 hover:text-white"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <button 
            onClick={toggleFullscreen} 
            className="text-white/90 hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/80 text-white">
          <div className="text-center p-4">
            <p className="mb-2">Error loading video</p>
            <button 
              className="px-4 py-2 bg-elvis-pink rounded hover:bg-elvis-pink/80 transition-colors"
              onClick={() => {
                setHasError(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfHostedPlayer;
