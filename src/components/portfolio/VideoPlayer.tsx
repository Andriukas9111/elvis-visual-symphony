
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import SelfHostedPlayer from './video-player/SelfHostedPlayer';
import YouTubePlayer from './video-player/YouTubePlayer';
import ChunkedVideoPlayer from './video-player/ChunkedVideoPlayer';
import { isYouTubeUrl, VideoErrorData, logVideoError, VideoErrorType } from './video-player/utils';
import { toast } from '@/hooks/use-toast';
import { useVideoConfig } from '@/hooks/useVideoConfig';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  fileSize?: number;
  onError?: (error: VideoErrorData) => void;
  controls?: boolean;
  muted?: boolean;
  playbackConfig?: {
    volume?: number;
    qualityLevel?: string;
    startAt?: number;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = true,
  loop,
  autoPlay,
  fileSize,
  onError,
  controls = true,
  muted,
  playbackConfig
}) => {
  const [urlStatus, setUrlStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { config: globalConfig, isLoading: configLoading } = useVideoConfig();
  const [isChunkedVideo, setIsChunkedVideo] = useState<boolean>(false);
  const [chunkedVideoId, setChunkedVideoId] = useState<string | null>(null);
  const sourceCheckedRef = useRef<boolean>(false);
  
  // Merge global config with component props
  const effectiveLoop = loop ?? globalConfig?.loop_default ?? false;
  const effectiveAutoPlay = autoPlay ?? globalConfig?.autoplay_default ?? false;
  const effectiveMuted = muted ?? (effectiveAutoPlay && globalConfig?.mute_on_autoplay) ?? false;
  
  // Check video URL validity
  useEffect(() => {
    if (sourceCheckedRef.current) {
      return; // Skip if we've already checked this URL
    }
    
    console.log("VideoPlayer mounted with:", { 
      videoUrl, 
      thumbnail, 
      title, 
      isVertical,
      thumbnailValid: !!thumbnail && thumbnail.length > 0,
      videoUrlValid: !!videoUrl && videoUrl.length > 0,
      fileSize,
      effectiveLoop,
      effectiveAutoPlay,
      effectiveMuted,
      globalConfig: configLoading ? 'loading' : globalConfig
    });
    
    // Basic validation
    if (!videoUrl || videoUrl.length === 0) {
      console.warn("Missing video URL for:", title);
      setUrlStatus('invalid');
      sourceCheckedRef.current = true;
      return;
    }
    
    // Check if this is a chunked video URL
    if (videoUrl.startsWith('/api/video/')) {
      console.log("Chunked video detected:", videoUrl);
      const id = videoUrl.split('/').pop();
      if (id) {
        setIsChunkedVideo(true);
        setChunkedVideoId(id);
        setUrlStatus('valid');
        sourceCheckedRef.current = true;
      } else {
        console.error("Invalid chunked video URL format:", videoUrl);
        setUrlStatus('invalid');
        setErrorDetails("Invalid chunked video URL format");
        sourceCheckedRef.current = true;
      }
      return;
    }
    
    // YouTube URLs are assumed valid
    if (isYouTubeUrl(videoUrl)) {
      console.log("YouTube video detected:", videoUrl);
      setUrlStatus('valid');
      sourceCheckedRef.current = true;
      return;
    }
    
    // For self-hosted videos, check if the URL is accessible
    console.log("Self-hosted video detected, checking URL:", videoUrl);
    
    // Check if the video URL is accessible for self-hosted videos
    const checkVideoUrl = async () => {
      try {
        // Use fetch with HEAD request to check if the URL is accessible
        const response = await fetch(videoUrl, { method: 'HEAD' });
        
        if (response.ok) {
          console.log("Video URL is accessible:", videoUrl);
          setUrlStatus('valid');
        } else {
          console.warn(`Video URL returned status ${response.status}:`, videoUrl);
          setUrlStatus('invalid');
          setErrorDetails(`Server returned status ${response.status}`);
          
          logVideoError(
            {
              type: VideoErrorType.NOT_FOUND,
              message: `Server returned status ${response.status}`,
              code: response.status,
              timestamp: Date.now()
            },
            { url: videoUrl, title }
          );
        }
        sourceCheckedRef.current = true;
      } catch (error: any) {
        console.error("Error checking video URL:", error);
        setUrlStatus('invalid');
        setErrorDetails(error.message || 'Network error occurred');
        
        logVideoError(
          {
            type: VideoErrorType.NETWORK,
            message: error.message || 'Network error occurred',
            details: error,
            timestamp: Date.now()
          },
          { url: videoUrl, title }
        );
        sourceCheckedRef.current = true;
      }
    };
    
    // Set a timeout to prevent waiting too long
    const timeoutId = setTimeout(() => {
      if (urlStatus === 'checking' && !sourceCheckedRef.current) {
        console.warn("Video URL check timed out:", videoUrl);
        setUrlStatus('invalid');
        setErrorDetails('Request timed out');
        
        logVideoError(
          {
            type: VideoErrorType.NETWORK,
            message: 'Request timed out',
            timestamp: Date.now()
          },
          { url: videoUrl, title }
        );
        sourceCheckedRef.current = true;
      }
    }, 5000);
    
    checkVideoUrl();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [videoUrl, title, urlStatus, globalConfig, configLoading, effectiveLoop, effectiveAutoPlay, effectiveMuted, fileSize, thumbnail, isVertical]);
  
  // Handle video errors
  const handleVideoError = useCallback((error: VideoErrorData) => {
    console.error("Video playback error:", error);
    
    // Show a toast for critical errors
    toast({
      title: "Video playback issue",
      description: error.message || "An error occurred during playback"
    });
    
    // Pass to parent if provided
    if (onError) {
      onError(error);
    }
  }, [onError]);
  
  // Default thumbnail if none provided or if the provided one is invalid
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail && thumbnail.length > 0 ? thumbnail : fallbackThumbnail;
  
  // Loading state
  if (urlStatus === 'checking') {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center" data-testid="video-loading">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
          <p className="text-white/70">Loading video...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (urlStatus === 'invalid') {
    console.error("Invalid video URL:", videoUrl);
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center" data-testid="video-error">
        <div className="flex flex-col items-center text-center px-4">
          <AlertCircle className="w-8 h-8 text-elvis-pink mb-2" />
          <p className="text-white/70 mb-1">Video source is not accessible</p>
          <p className="text-white/50 text-sm">{videoUrl ? `URL: ${videoUrl.substring(0, 50)}...` : 'No URL provided'}</p>
          {errorDetails && <p className="text-white/50 text-xs mt-2">Error: {errorDetails}</p>}
        </div>
      </div>
    );
  }
  
  // Get preload strategy from global config
  const preload = globalConfig?.preload_strategy || 'metadata';
  
  // Determine volume based on config/props
  const initialVolume = playbackConfig?.volume ?? globalConfig?.default_volume ?? 0.7;
  
  // Render chunked video player
  if (isChunkedVideo && chunkedVideoId) {
    return (
      <ChunkedVideoPlayer
        videoId={chunkedVideoId}
        thumbnail={effectiveThumbnail}
        title={title}
        isVertical={isVertical}
        onPlay={onPlay}
        loop={effectiveLoop}
        autoPlay={effectiveAutoPlay}
        controls={controls}
        muted={effectiveMuted}
        onError={handleVideoError}
        initialVolume={initialVolume}
        hideOverlayText={true}
      />
    );
  }
  
  // Render the appropriate player based on the URL type
  return isYouTubeUrl(videoUrl) ? (
    <YouTubePlayer 
      videoUrl={videoUrl}
      thumbnail={effectiveThumbnail}
      title={title}
      isVertical={isVertical}
      onPlay={onPlay}
      hideOverlayText={true}
      autoPlay={effectiveAutoPlay}
      loop={effectiveLoop}
      muted={effectiveMuted}
      controls={controls}
      onError={handleVideoError}
      initialVolume={initialVolume}
      startAt={playbackConfig?.startAt}
    />
  ) : (
    <SelfHostedPlayer
      videoUrl={videoUrl}
      thumbnail={effectiveThumbnail}
      title={title}
      isVertical={isVertical}
      onPlay={onPlay}
      hideOverlayText={true}
      loop={effectiveLoop}
      autoPlay={effectiveAutoPlay}
      preload={preload}
      fileSize={fileSize}
      onError={handleVideoError}
      controls={controls}
      muted={effectiveMuted}
      initialVolume={initialVolume}
    />
  );
};

export default VideoPlayer;
