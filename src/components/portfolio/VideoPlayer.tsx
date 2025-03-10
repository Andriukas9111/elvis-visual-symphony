
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import SelfHostedPlayer from './video-player/SelfHostedPlayer';
import YouTubePlayer from './video-player/YouTubePlayer';
import { isYouTubeUrl, VideoErrorData, logVideoError } from './video-player/utils';
import { toast } from '@/hooks/use-toast';

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
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = true,
  loop = false,
  autoPlay = false,
  fileSize,
  onError
}) => {
  const [urlStatus, setUrlStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Enhanced debugging
  useEffect(() => {
    console.log("VideoPlayer mounted with:", { 
      videoUrl, 
      thumbnail, 
      title, 
      isVertical,
      thumbnailValid: !!thumbnail && thumbnail.length > 0,
      videoUrlValid: !!videoUrl && videoUrl.length > 0,
      fileSize
    });
    
    // Reset status when URL changes
    setUrlStatus('checking');
    setErrorDetails(null);
    
    // Basic validation
    if (!videoUrl || videoUrl.length === 0) {
      console.warn("Missing video URL for:", title);
      setUrlStatus('invalid');
      return;
    }
    
    // YouTube URLs are assumed valid
    if (isYouTubeUrl(videoUrl)) {
      console.log("YouTube video detected:", videoUrl);
      setUrlStatus('valid');
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
          
          // Log as an error for tracking
          logVideoError(
            {
              type: 'not_found',
              message: `Server returned status ${response.status}`,
              code: response.status,
              timestamp: Date.now()
            },
            { url: videoUrl, title }
          );
        }
      } catch (error: any) {
        console.error("Error checking video URL:", error);
        setUrlStatus('invalid');
        setErrorDetails(error.message || 'Network error occurred');
        
        // Log as an error for tracking
        logVideoError(
          {
            type: 'network',
            message: error.message || 'Network error occurred',
            details: error,
            timestamp: Date.now()
          },
          { url: videoUrl, title }
        );
      }
    };
    
    checkVideoUrl();
    
    // Set a timeout to prevent waiting too long
    const timeoutId = setTimeout(() => {
      if (urlStatus === 'checking') {
        console.warn("Video URL check timed out:", videoUrl);
        setUrlStatus('invalid');
        setErrorDetails('Request timed out');
        
        // Log as an error for tracking
        logVideoError(
          {
            type: 'network',
            message: 'Request timed out',
            timestamp: Date.now()
          },
          { url: videoUrl, title }
        );
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [videoUrl, title, urlStatus]);
  
  // Handle video errors
  const handleVideoError = (error: VideoErrorData) => {
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
  };
  
  // Default thumbnail if none provided or if the provided one is invalid
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail && thumbnail.length > 0 ? thumbnail : fallbackThumbnail;
  
  // Loading state
  if (urlStatus === 'checking') {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center" data-testid="video-loading">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
          <p className="text-white/70">Checking video source...</p>
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
  
  // Render the appropriate player based on the URL type
  return isYouTubeUrl(videoUrl) ? (
    <YouTubePlayer 
      videoUrl={videoUrl}
      thumbnail={effectiveThumbnail}
      title={title}
      isVertical={isVertical}
      onPlay={onPlay}
      hideOverlayText={hideOverlayText}
    />
  ) : (
    <SelfHostedPlayer
      videoUrl={videoUrl}
      thumbnail={effectiveThumbnail}
      title={title}
      isVertical={isVertical}
      onPlay={onPlay}
      hideOverlayText={hideOverlayText}
      loop={loop}
      autoPlay={autoPlay}
      preload="metadata"
      fileSize={fileSize}
      onError={handleVideoError}
    />
  );
};

export default VideoPlayer;
