
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Loader2, AlertCircle, RefreshCw, Wifi, WifiOff, Slash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { 
  formatVideoDuration,
  VideoErrorType,
  VideoErrorData,
  createVideoErrorData,
  getErrorMessage,
  getAlternativeFormats,
  logVideoError,
  getOptimalPreload,
  testVideoPlayback,
  isVideoFormatSupported,
  getFileExtensionFromUrl
} from './utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

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
  quality?: 'auto' | 'high' | 'medium' | 'low';
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
  preload: userPreload,
  fileSize,
  onError,
  quality = 'auto'
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const retryAttemptsRef = useRef<number>(0);
  const alternativeFormatsRef = useRef<string[]>([]);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<VideoErrorType>(VideoErrorType.UNKNOWN);
  const [loadProgress, setLoadProgress] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isControlsHovering, setIsControlsHovering] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isNetworkSlow, setIsNetworkSlow] = useState(false);
  const [videoQuality, setVideoQuality] = useState<string>(quality);
  const [supportsFormat, setSupportsFormat] = useState(true);
  const { prefersReducedMotion } = useAnimation();
  
  // Determine optimal preload strategy (auto, metadata, or none)
  const optimalPreload = getOptimalPreload(fileSize);
  const preload = userPreload || optimalPreload;

  // Control visibility timeout
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Store alternative formats for fallback
    if (videoUrl) {
      alternativeFormatsRef.current = getAlternativeFormats(videoUrl);
      
      // Check if this format is supported
      const format = getFileExtensionFromUrl(videoUrl);
      if (format) {
        const supported = isVideoFormatSupported(format);
        setSupportsFormat(supported);
        
        if (!supported) {
          // Log and display format compatibility error
          setHasError(true);
          setErrorType(VideoErrorType.FORMAT);
          setErrorMessage(getErrorMessage(VideoErrorType.FORMAT));
          
          // Try to find a supported format
          const supportedFormat = alternativeFormatsRef.current.find(url => {
            const format = getFileExtensionFromUrl(url);
            return isVideoFormatSupported(format);
          });
          
          if (supportedFormat) {
            console.log(`Original format not supported, trying: ${supportedFormat}`);
            // We have a supported format, we'll switch to it when retry is clicked
          }
        }
      }
      
      // Check network conditions
      const connection = (navigator as any).connection;
      if (connection) {
        setIsNetworkSlow(connection.saveData || 
                         connection.effectiveType === 'slow-2g' || 
                         connection.effectiveType === '2g');
                         
        const updateNetworkStatus = () => {
          setIsNetworkSlow(connection.saveData || 
                           connection.effectiveType === 'slow-2g' || 
                           connection.effectiveType === '2g');
        };
        
        connection.addEventListener('change', updateNetworkStatus);
        return () => connection.removeEventListener('change', updateNetworkStatus);
      }
    }
  }, [videoUrl]);

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
    
    if (hasError) {
      // If there's an error, try to recover
      handleRetry();
      return;
    }
    
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  }, [isLoading, hasError]);

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
      
      let errorType = VideoErrorType.UNKNOWN;
      
      if (error.name === 'NotAllowedError') {
        errorType = VideoErrorType.PERMISSION;
        setErrorMessage('Browser blocked autoplay. Please click to play.');
      } else if (error.name === 'NotSupportedError') {
        errorType = VideoErrorType.FORMAT;
        setErrorMessage('This video format is not supported by your browser.');
      } else if (error.name === 'AbortError') {
        errorType = VideoErrorType.UNKNOWN;
        setErrorMessage('Video playback was aborted.');
      } else if (error.name === 'NetworkError') {
        errorType = VideoErrorType.NETWORK;
        setErrorMessage('A network error occurred while loading the video.');
      } else {
        setErrorMessage(error.message || 'Failed to play video');
      }
      
      setErrorType(errorType);
      
      // Log the error
      const errorData: VideoErrorData = {
        type: errorType,
        message: error.message || 'Unknown error during play attempt',
        details: error,
        timestamp: Date.now()
      };
      
      logVideoError(errorData, { url: videoUrl, title });
      
      if (onError) {
        onError(errorData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, onPlay, onError, title]);

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
        toast({
          title: "Fullscreen error",
          description: "Unable to enter fullscreen mode",
        });
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

  // Retry loading video with potential format switching
  const handleRetry = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setIsRetrying(true);
    setHasError(false);
    setErrorMessage('');
    
    const maxRetries = 3;
    
    if (!videoRef.current) {
      setIsRetrying(false);
      return;
    }
    
    // Check if we have alternative formats to try
    if (retryAttemptsRef.current >= 1 && alternativeFormatsRef.current.length > 0) {
      // Try switching to an alternative format
      const nextFormatIndex = retryAttemptsRef.current - 1;
      
      if (nextFormatIndex < alternativeFormatsRef.current.length) {
        const alternativeUrl = alternativeFormatsRef.current[nextFormatIndex];
        
        console.log(`Retry attempt ${retryAttemptsRef.current}: Trying alternative format: ${alternativeUrl}`);
        
        // Test if this format will play
        const { canPlay, error } = await testVideoPlayback(alternativeUrl);
        
        if (canPlay) {
          console.log(`Alternative format seems playable: ${alternativeUrl}`);
          // Update source and try again
          videoRef.current.src = alternativeUrl;
        } else {
          console.error(`Alternative format test failed: ${error}`);
        }
      }
    }
    
    // Increment retry counter
    retryAttemptsRef.current++;
    
    // If we've exceeded max retries, show a permanent error
    if (retryAttemptsRef.current > maxRetries) {
      setHasError(true);
      setErrorType(VideoErrorType.UNKNOWN);
      setErrorMessage(`Unable to play video after ${maxRetries} attempts. Please try again later.`);
      setIsRetrying(false);
      
      // Log the max retries error
      const errorData: VideoErrorData = {
        type: VideoErrorType.UNKNOWN,
        message: `Max retries (${maxRetries}) exceeded`,
        timestamp: Date.now()
      };
      
      logVideoError(errorData, { url: videoUrl, title });
      
      if (onError) {
        onError(errorData);
      }
      
      return;
    }
    
    try {
      // Reload and try to play again
      videoRef.current.load();
      await playVideo();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [videoUrl, playVideo, onError, title]);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Reset retry counter when video URL changes
    retryAttemptsRef.current = 0;
    
    const handleLoadStart = () => {
      console.log("Video load started:", videoUrl);
      setIsLoading(true);
      setHasError(false);
    };
    
    const handleLoadedData = () => {
      console.log("Video data loaded:", videoUrl);
      setIsLoading(false);
      
      // If auto-play is enabled and we're not on a mobile device (to avoid autoplay restrictions)
      if (autoPlay && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        playVideo();
      }
    };
    
    const handleError = (e: Event) => {
      const videoErrorData = createVideoErrorData(e);
      console.error("Video error:", videoErrorData);
      
      setIsLoading(false);
      setHasError(true);
      setErrorType(videoErrorData.type);
      setErrorMessage(videoErrorData.message);
      
      // Log the error
      logVideoError(videoErrorData, { url: videoUrl, title });
      
      if (onError) {
        onError(videoErrorData);
      }
      
      // For network errors, we can try to recover automatically
      if (videoErrorData.type === VideoErrorType.NETWORK && retryAttemptsRef.current < 2) {
        // Wait a moment before retrying
        setTimeout(() => {
          handleRetry();
        }, 3000);
      }
    };
    
    const handleStalled = () => {
      console.warn("Video playback stalled");
      setIsNetworkSlow(true);
      
      // If we're already playing, show a temporary toast
      if (isPlaying) {
        toast({
          title: "Network issue detected",
          description: "Video playback may be affected by slow network",
        });
      }
    };
    
    const handleWaiting = () => {
      console.log("Video waiting for more data");
      setIsLoading(true);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
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
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
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
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
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
    handleProgress,
    handleRetry,
    isPlaying,
    onError,
    title
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

  // Get appropriate error icon based on error type
  const getErrorIcon = () => {
    switch (errorType) {
      case VideoErrorType.NETWORK:
        return <WifiOff className="w-10 h-10 text-elvis-pink mx-auto mb-3" />;
      case VideoErrorType.FORMAT:
        return <Slash className="w-10 h-10 text-elvis-pink mx-auto mb-3" />;
      case VideoErrorType.NOT_FOUND:
        return <AlertCircle className="w-10 h-10 text-elvis-pink mx-auto mb-3" />;
      default:
        return <AlertCircle className="w-10 h-10 text-elvis-pink mx-auto mb-3" />;
    }
  };

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
      data-testid="self-hosted-player"
    >
      {/* Slow network indicator */}
      {isNetworkSlow && isPlaying && !hasError && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-elvis-dark/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Wifi className="w-3 h-3 mr-1 text-yellow-400" />
            Slow Network
          </div>
        </div>
      )}
      
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
            {isLoading || isRetrying ? (
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

      {/* Format not supported warning */}
      {!supportsFormat && !hasError && (
        <div className="absolute top-2 left-2 z-20 max-w-[80%]">
          <Alert variant="destructive" className="bg-elvis-dark/90 border-elvis-pink/30 py-1 px-2">
            <AlertTitle className="text-xs text-white">Format not supported</AlertTitle>
            <AlertDescription className="text-xs text-white/70">
              Alternative format will be tried when you play
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Video element with multiple sources for browser compatibility */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${!isPlaying ? 'invisible' : 'visible'}`}
        playsInline
        muted
        preload={preload}
        loop={loop}
        onContextMenu={(e) => e.preventDefault()}
        poster={thumbnail}
        data-testid="video-element"
      >
        <source src={videoUrl} type={`video/${getFileExtensionFromUrl(videoUrl)}`} />
        {alternativeFormatsRef.current.map((url, index) => (
          <source 
            key={index} 
            src={url} 
            type={`video/${getFileExtensionFromUrl(url)}`} 
          />
        ))}
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
            data-testid="video-controls"
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
                data-testid="progress-bar"
              >
                {/* Buffered progress */}
                <div 
                  className="absolute h-2 bg-white/30 rounded-full"
                  style={{ width: `${loadProgress}%` }}
                  data-testid="buffer-progress"
                />
                {/* Playback progress */}
                <div 
                  className="h-full bg-elvis-pink rounded-full relative"
                  style={{ width: `${playProgress}%` }}
                  data-testid="play-progress"
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
                    data-testid="play-pause-button"
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
                    data-testid="mute-button"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  {/* Time display */}
                  <div className="text-white/80 text-xs" data-testid="time-display">
                    {formatVideoDuration(currentTime)} / {formatVideoDuration(duration)}
                  </div>
                </div>
                
                {/* Fullscreen button */}
                <button 
                  onClick={toggleFullscreen} 
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  data-testid="fullscreen-button"
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
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/90 text-white z-20" data-testid="error-message">
          <div className="text-center p-4 max-w-md">
            {getErrorIcon()}
            <p className="mb-3 text-white/90">{errorMessage || getErrorMessage(errorType)}</p>
            
            {errorType === VideoErrorType.NETWORK && (
              <div className="text-sm text-white/70 mb-3">
                This may be due to a temporary network issue or the video file being unavailable.
              </div>
            )}
            
            {errorType === VideoErrorType.FORMAT && (
              <div className="text-sm text-white/70 mb-3">
                Your browser doesn't support this video format. Try using a different browser or contact us for assistance.
              </div>
            )}
            
            <button 
              className="px-4 py-2 bg-elvis-pink rounded hover:bg-elvis-pink/80 transition-colors flex items-center mx-auto"
              onClick={handleRetry}
              data-testid="retry-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again {retryAttemptsRef.current > 0 ? `(${retryAttemptsRef.current}/${3})` : ''}
            </button>
          </div>
        </div>
      )}
      
      {/* Loading indicator - shown when initially loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/60 z-20" data-testid="loading-indicator">
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
