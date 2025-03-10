
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  isVertical?: boolean;
  onPlay?: () => void;
  onError?: (error: string) => void;
  className?: string;
  autoPlay?: boolean;
}

const BasicVideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  isVertical = false,
  onPlay,
  onError,
  className = '',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Reset states when URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);
  
  const handlePlay = () => {
    if (!videoRef.current) return;
    
    if (!isPlaying) {
      setIsLoading(true);
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            if (onPlay) onPlay();
          })
          .catch((err) => {
            console.error('Error playing video:', err);
            setIsPlaying(false);
            setIsLoading(false);
            setHasError(true);
            if (onError) onError('Failed to play video');
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };
  
  const handleLoadedData = () => {
    console.log('Video loaded successfully:', src);
    setIsLoading(false);
    
    if (autoPlay) {
      handlePlay();
    }
  };
  
  const handleError = () => {
    console.error('Error loading video:', src);
    setIsLoading(false);
    setHasError(true);
    if (onError) onError('Failed to load video');
  };

  return (
    <div className={`relative overflow-hidden ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        preload="metadata"
        playsInline
        onLoadedData={handleLoadedData}
        onError={handleError}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker/80 z-10">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin" />
        </div>
      )}

      {/* Error Display */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-elvis-darker/90 z-10">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-white text-sm">Video cannot be played</p>
          <p className="text-white/60 text-xs mt-1">{src}</p>
        </div>
      )}

      {/* Play/Pause Overlay (only show when not playing or on hover) */}
      {(!isPlaying || !isLoading) && (
        <button 
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 z-10
                    hover:bg-black/40 transition-all duration-300 group"
          onClick={handlePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {!isPlaying && !isLoading && (
            <div className="h-14 w-14 rounded-full bg-elvis-pink/80 flex items-center justify-center
                          group-hover:bg-elvis-pink group-hover:scale-110 transition-all duration-300">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          )}
        </button>
      )}

      {/* Controls (shown when playing) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent
                      opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center z-20">
          <button
            className="h-8 w-8 rounded-full bg-elvis-darker/80 flex items-center justify-center
                      hover:bg-elvis-pink transition-colors duration-300 mr-2"
            onClick={handlePlay}
            aria-label="Pause"
          >
            <Pause className="w-4 h-4 text-white" />
          </button>
          
          <button
            className="h-8 w-8 rounded-full bg-elvis-darker/80 flex items-center justify-center
                      hover:bg-elvis-pink transition-colors duration-300"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
          
          {title && (
            <div className="ml-auto">
              <p className="text-white text-xs font-medium">{title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BasicVideoPlayer;
