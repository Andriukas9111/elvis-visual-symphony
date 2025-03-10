
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SelfHostedPlayer from './video-player/SelfHostedPlayer';
import YouTubePlayer from './video-player/YouTubePlayer';
import { isYouTubeUrl } from './video-player/utils';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = true
}) => {
  const [urlStatus, setUrlStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  
  // Enhanced debugging
  useEffect(() => {
    console.log("VideoPlayer mounted with:", { 
      videoUrl, 
      thumbnail, 
      title, 
      isVertical,
      thumbnailValid: !!thumbnail && thumbnail.length > 0,
      videoUrlValid: !!videoUrl && videoUrl.length > 0
    });
    
    // Reset status when URL changes
    setUrlStatus('checking');
    
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
        }
      } catch (error) {
        console.error("Error checking video URL:", error);
        setUrlStatus('invalid');
      }
    };
    
    checkVideoUrl();
    
    // Set a timeout to prevent waiting too long
    const timeoutId = setTimeout(() => {
      if (urlStatus === 'checking') {
        console.warn("Video URL check timed out:", videoUrl);
        setUrlStatus('invalid');
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [videoUrl, title]);
  
  // Default thumbnail if none provided or if the provided one is invalid
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail && thumbnail.length > 0 ? thumbnail : fallbackThumbnail;
  
  if (urlStatus === 'checking') {
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-elvis-pink animate-spin mb-2" />
          <p className="text-white/70">Checking video source...</p>
        </div>
      </div>
    );
  }
  
  if (urlStatus === 'invalid') {
    console.error("Invalid video URL:", videoUrl);
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
        <p className="text-white/70">Video source is not accessible</p>
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
    />
  );
};

export default VideoPlayer;
