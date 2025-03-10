
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Download, 
  Loader2, AlertCircle, SkipBack, SkipForward 
} from 'lucide-react';
import { isYouTubeUrl, getYoutubeId } from '../video-player/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVideoConfig } from '@/hooks/useVideoConfig';
import { ChunkedVideoPlayer } from './ChunkedVideoPlayer';
import { YouTubePlayer } from './YouTubePlayer';
import { SelfHostedPlayer } from './SelfHostedPlayer';

interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  bufferedTime?: number;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek,
  bufferedTime = 0
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    onSeek(newTime);
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const buffered = duration > 0 ? (bufferedTime / duration) * 100 : 0;
  
  return (
    <div 
      ref={progressRef}
      className="h-2 bg-elvis-dark rounded-full cursor-pointer group relative"
      onClick={handleProgressClick}
    >
      {/* Buffered progress */}
      <div 
        className="absolute h-full bg-white/20 rounded-full"
        style={{ width: `${buffered}%` }}
      />
      
      {/* Actual progress */}
      <div 
        className="absolute h-full bg-elvis-pink rounded-full"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

interface UnifiedVideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  fileSize?: number;
  controls?: boolean;
  muted?: boolean;
  downloadUrl?: string;
  onError?: (error: any) => void;
  initialVolume?: number;
}

const UnifiedVideoPlayer: React.FC<UnifiedVideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  hideOverlayText = false,
  loop,
  autoPlay,
  fileSize,
  controls = true,
  muted,
  downloadUrl,
  onError,
  initialVolume
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume || 0.7);
  const [isMuted, setIsMuted] = useState(muted || false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChunkedVideo, setIsChunkedVideo] = useState(false);
  const [chunkedVideoId, setChunkedVideoId] = useState<string | null>(null);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { config } = useVideoConfig();
  
  // Merge global config with component props
  const effectiveLoop = loop ?? config?.loop_default ?? false;
  const effectiveAutoPlay = autoPlay ?? config?.autoplay_default ?? false;
  const effectiveMuted = muted ?? (effectiveAutoPlay && config?.mute_on_autoplay) ?? false;
  
  // Determine video type (YouTube, chunked or self-hosted)
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    if (!videoUrl) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }
    
    // Check if this is a chunked video
    if (videoUrl.startsWith('/api/video/')) {
      const id = videoUrl.split('/').pop();
      if (id) {
        setIsChunkedVideo(true);
        setChunkedVideoId(id);
        setIsLoading(false);
      } else {
        setError('Invalid chunked video URL format');
        setIsLoading(false);
      }
      return;
    }
    
    // For self-hosted videos, check if the URL is accessible
    if (!isYouTubeUrl(videoUrl)) {
      fetch(videoUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error checking video URL:', error);
          setError('Video source is not accessible');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [videoUrl]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && onPlay) {
      onPlay();
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle seeking
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error attempting to enable fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error attempting to exit fullscreen:', err));
    }
  };
  
  // Handle downloading video
  const handleDownload = () => {
    const url = downloadUrl || videoUrl;
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle errors
  const handleVideoError = (errorData: any) => {
    setError(errorData.message || 'An error occurred during playback');
    setIsLoading(false);
    if (onError) {
      onError(errorData);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker flex items-center justify-center`}>
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
          <p className="text-white/70">Loading video...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker flex items-center justify-center`}>
        <div className="flex flex-col items-center text-center px-4">
          <AlertCircle className="w-8 h-8 text-elvis-pink mb-2" />
          <p className="text-white/70 mb-1">Video could not be loaded</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  // Render player based on video type
  return (
    <div 
      ref={videoContainerRef}
      className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker`}
    >
      {isChunkedVideo && chunkedVideoId ? (
        <ChunkedVideoPlayer
          videoId={chunkedVideoId}
          thumbnail={thumbnail}
          title={title}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          isMuted={isMuted}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
          bufferedTime={bufferedTime}
          setBufferedTime={setBufferedTime}
          loop={effectiveLoop}
          onError={handleVideoError}
        />
      ) : isYouTubeUrl(videoUrl) ? (
        <YouTubePlayer
          videoUrl={videoUrl}
          thumbnail={thumbnail}
          title={title}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          isMuted={isMuted}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
          loop={effectiveLoop}
          onError={handleVideoError}
        />
      ) : (
        <SelfHostedPlayer
          videoUrl={videoUrl}
          thumbnail={thumbnail}
          title={title}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          isMuted={isMuted}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
          bufferedTime={bufferedTime}
          setBufferedTime={setBufferedTime}
          loop={effectiveLoop}
          fileSize={fileSize}
          onError={handleVideoError}
        />
      )}
      
      {/* Overlay controls */}
      {controls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          {/* Title */}
          {!hideOverlayText && (
            <h3 className="text-white font-medium mb-3">{title}</h3>
          )}
          
          {/* Progress bar */}
          <VideoProgressBar 
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            bufferedTime={bufferedTime}
          />
          
          {/* Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3">
              {/* Play/Pause button */}
              <button 
                onClick={togglePlayPause}
                className="text-white hover:text-elvis-pink transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              {/* Time display */}
              <div className="text-white/80 text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-elvis-pink transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                
                <div className="w-16 hidden sm:block">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Download button (for self-hosted videos only) */}
              {!isYouTubeUrl(videoUrl) && !isChunkedVideo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={handleDownload}
                        className="text-white hover:text-elvis-pink transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download video</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Fullscreen button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={toggleFullscreen}
                      className="text-white hover:text-elvis-pink transition-colors"
                    >
                      <Maximize className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedVideoPlayer;
