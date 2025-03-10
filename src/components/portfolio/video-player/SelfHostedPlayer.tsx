
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { formatVideoDuration } from './utils';

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
  preload = 'metadata'
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isControlsHovering, setIsControlsHovering] = useState(false);
  const { prefersReducedMotion } = useAnimation();

  // Control visibility timeout
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update duration when metadata is loaded
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    setDuration(video.duration);
    console.log(`Video metadata loaded. Duration: ${video.duration}s`);
  }, []);

  // Play/pause video
  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  }, [isLoading]);

  // Play video with error handling
  const playVideo = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(true);
      setHasError(false);
      
      console.log('Attempting to play video:', videoUrl);
      
      // This will trigger the loading of the video
      await videoRef.current.play();
      setIsPlaying(true);
      
      // Show controls briefly when video starts
      showControlsTemporarily();
      
      if (onPlay) {
        onPlay();
      }
    } catch (error: any) {
      console.error('Error playing video:', error);
      setHasError(true);
      setErrorMessage(error.message || 'Failed to play video');
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Browser blocked autoplay. Please click to play.');
      } else if (error.name === 'NotSupportedError') {
        setErrorMessage('This video format is not supported by your browser.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, onPlay]);

  // Pause video
  const pauseVideo = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle mute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  }, []);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    
    setCurrentTime(video.currentTime);
    setPlayProgress(progress);
  }, []);

  // Handle progress (buffering)
  const handleProgress = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      
      if (duration > 0) {
        setLoadProgress((bufferedEnd / duration) * 100);
      }
    }
  }, []);

  // Handle seeking
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    if (!progressBarRef.current || !videoRef.current) return;
    
    const progressRect = progressBarRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    
    if (seekPosition >= 0 && seekPosition <= 1) {
      const seekTime = videoRef.current.duration * seekPosition;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setPlayProgress(seekPosition * 100);
    }
  }, []);

  // Show controls temporarily
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    
    // Clear any existing timeout
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    
    // Set a new timeout to hide controls
    hideControlsTimeout.current = setTimeout(() => {
      if (!isControlsHovering) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isControlsHovering]);

  // Handle mouse move to show controls
  const handleMouseMove = useCallback(() => {
    if (!isPlaying) return;
    
    showControlsTemporarily();
    
    // Debounce rapid mouse movements
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (!isControlsHovering) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isPlaying, isControlsHovering, showControlsTemporarily]);

  // Retry loading video
  const handleRetry = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    setHasError(false);
    setErrorMessage('');
    
    if (videoRef.current) {
      videoRef.current.load();
      playVideo();
    }
  }, [playVideo]);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadStart = () => {
      console.log("Video load started:", videoUrl);
      setIsLoading(true);
      setHasError(false);
    };
    
    const handleLoadedData = () => {
      console.log("Video data loaded:", videoUrl);
      setIsLoading(false);
      if (autoPlay) {
        playVideo();
      }
    };
    
    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      console.error("Video error:", videoElement.error);
      setIsLoading(false);
      setHasError(true);
      
      // Set appropriate error message based on error code
      if (videoElement.error) {
        switch (videoElement.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            setErrorMessage('Video playback was aborted.');
            break;
          case 2: // MEDIA_ERR_NETWORK
            setErrorMessage('A network error caused the video download to fail.');
            break;
          case 3: // MEDIA_ERR_DECODE
            setErrorMessage('The video could not be decoded. The file might be corrupted.');
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            setErrorMessage('The video format is not supported by your browser.');
            break;
          default:
            setErrorMessage('An unknown error occurred.');
        }
      }
    };
    
    const handleEnded = () => {
      console.log("Video playback ended");
      setIsPlaying(false);
      setPlayProgress(0);
      setCurrentTime(0);
      
      if (loop) {
        video.currentTime = 0;
        playVideo();
      }
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Clean up on unmount
    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      // Clear any pending timeouts
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Pause video when component unmounts to prevent memory leaks
      if (!video.paused) {
        video.pause();
      }
    };
  }, [
    videoUrl, 
    autoPlay, 
    loop, 
    playVideo, 
    handleLoadedMetadata, 
    handleTimeUpdate, 
    handleProgress
  ]);

  // Reset muted state when isPlaying changes
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Ensure video is muted when not playing
    if (!isPlaying) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isPlaying]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
  }, []);

  // Improved component structure with animation
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker cursor-pointer group`} 
      onClick={togglePlayPause}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying && !isControlsHovering) {
          setControlsVisible(false);
        }
      }}
    >
      {/* Thumbnail overlay - shown until video plays */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              console.error("Thumbnail load error:", thumbnail);
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
              <h3 className="text-white font-medium truncate">{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${!isPlaying ? 'invisible' : 'visible'}`}
        playsInline
        muted
        preload={preload}
        loop={loop}
        onContextMenu={(e) => e.preventDefault()}
        poster={thumbnail}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay - conditionally visible */}
      <AnimatePresence>
        {isPlaying && controlsVisible && (
          <motion.div 
            className="absolute inset-0 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsControlsHovering(true)}
            onMouseLeave={() => setIsControlsHovering(false)}
          >
            {/* Video gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            
            {/* Video controls */}
            <div className="relative z-10 p-3 pb-4">
              {/* Progress bar */}
              <div 
                ref={progressBarRef}
                className="h-2 mb-3 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                onClick={handleSeek}
              >
                {/* Buffered progress */}
                <div 
                  className="absolute h-2 bg-white/30 rounded-full"
                  style={{ width: `${loadProgress}%` }}
                />
                {/* Playback progress */}
                <div 
                  className="h-full bg-elvis-pink rounded-full relative"
                  style={{ width: `${playProgress}%` }}
                >
                  {/* Progress handle */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
              
              {/* Controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Play/Pause button */}
                  <button 
                    className="text-white/90 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Volume control */}
                  <button 
                    onClick={toggleMute} 
                    className="text-white/90 hover:text-white transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  {/* Time display */}
                  <div className="text-white/80 text-xs">
                    {formatVideoDuration(currentTime)} / {formatVideoDuration(duration)}
                  </div>
                </div>
                
                {/* Fullscreen button */}
                <button 
                  onClick={toggleFullscreen} 
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/90 text-white z-20">
          <div className="text-center p-4">
            <AlertCircle className="w-10 h-10 text-elvis-pink mx-auto mb-3" />
            <p className="mb-3 text-white/90">{errorMessage || 'Error loading video'}</p>
            <button 
              className="px-4 py-2 bg-elvis-pink rounded hover:bg-elvis-pink/80 transition-colors flex items-center mx-auto"
              onClick={handleRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Loading indicator - shown when initially loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/60 z-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-elvis-pink mx-auto animate-spin mb-2" />
            <p className="text-white/80">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfHostedPlayer;
