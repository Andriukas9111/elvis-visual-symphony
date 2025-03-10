
import React, { useEffect, useState } from 'react';
import VideoPlayer from '@/components/portfolio/video-player';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

const VideoPlayerWrapper: React.FC<VideoPlayerProps> = ({ 
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
    console.log("VideoPlayerWrapper effect running with:", { 
      videoUrl, 
      thumbnail, 
      title, 
      isVertical,
      thumbnailValid: !!thumbnail && thumbnail.length > 0,
      videoUrlValid: !!videoUrl && videoUrl.length > 0
    });
    
    // Check if the video URL is accessible for self-hosted videos
    if (videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      console.log("Self-hosted video detected:", videoUrl);
      setUrlStatus('checking');
      
      // Create an HTMLVideoElement to test loading
      const videoElement = document.createElement('video');
      
      // Set up event listeners
      const handleCanPlayThrough = () => {
        console.log("Video can play through:", videoUrl);
        setUrlStatus('valid');
        cleanupVideoElement();
      };
      
      const handleError = () => {
        console.warn("Video URL is not accessible:", videoUrl);
        setUrlStatus('invalid');
        cleanupVideoElement();
      };
      
      const cleanupVideoElement = () => {
        videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        videoElement.removeEventListener('error', handleError);
        videoElement.src = '';
      };
      
      videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
      videoElement.addEventListener('error', handleError);
      
      // Set a timeout to prevent waiting too long
      const timeoutId = setTimeout(() => {
        if (urlStatus === 'checking') {
          console.warn("Video URL check timed out:", videoUrl);
          setUrlStatus('invalid');
          cleanupVideoElement();
        }
      }, 5000);
      
      // Set the source and start loading
      videoElement.src = videoUrl;
      videoElement.load();
      
      return () => {
        clearTimeout(timeoutId);
        cleanupVideoElement();
      };
    } else {
      // YouTube videos are assumed valid
      setUrlStatus('valid');
    }
  }, [videoUrl, thumbnail, title, isVertical]);
  
  // Default thumbnail if none provided or if the provided one is invalid
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail && thumbnail.length > 0 ? thumbnail : fallbackThumbnail;
  
  // Ensure video URL is valid
  const effectiveVideoUrl = videoUrl && videoUrl.length > 0 ? videoUrl : '';
  
  if (!effectiveVideoUrl) {
    console.warn("Missing video URL for:", title);
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
        <p className="text-white/70">No video source available</p>
      </div>
    );
  }
  
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
  
  return (
    <VideoPlayer 
      videoUrl={effectiveVideoUrl} 
      thumbnail={effectiveThumbnail} 
      title={title}
      isVertical={isVertical} 
      onPlay={onPlay}
      hideOverlayText={hideOverlayText}
    />
  );
};

export default VideoPlayerWrapper;
