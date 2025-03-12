
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  isVertical?: boolean;
  onError?: (error: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  isVertical = false,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Set initial states
    videoRef.current.muted = muted;
    
    // Event listeners
    const onLoadedData = () => setIsLoading(false);
    const onError = (e: any) => {
      console.error('Video playback error:', e);
      setHasError(true);
      setIsLoading(false);
      setErrorMessage('Failed to load video');
      if (onError) onError(e);
    };
    
    videoRef.current.addEventListener('loadeddata', onLoadedData);
    videoRef.current.addEventListener('error', onError);
    
    return () => {
      if (!videoRef.current) return;
      videoRef.current.removeEventListener('loadeddata', onLoadedData);
      videoRef.current.removeEventListener('error', onError);
    };
  }, [muted, onError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error playing video:', error);
            setIsLoading(false);
            setIsPlaying(false);
            
            // Handle autoplay policy issues
            if (error.name === 'NotAllowedError') {
              setIsMuted(true);
              videoRef.current!.muted = true;
              videoRef.current!.play().catch(e => console.error('Still cannot play:', e));
            }
          });
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl bg-black",
        isVertical ? "aspect-[9/16]" : "aspect-video",
        className
      )}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={controls ? togglePlay : undefined}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      
      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4">
          <div>
            <p className="font-semibold">Unable to play video</p>
            <p className="text-sm opacity-80">{errorMessage}</p>
          </div>
        </div>
      )}
      
      {/* Play/Pause overlay when not playing */}
      {!isPlaying && !isLoading && controls && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
      
      {/* Controls */}
      {controls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
          <button 
            className="text-white hover:text-white/80 transition"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <span className="text-white/90 text-sm font-medium truncate mx-2">
            {title}
          </span>
          
          <button 
            className="text-white hover:text-white/80 transition"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
