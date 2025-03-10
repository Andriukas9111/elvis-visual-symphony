
import React, { useEffect } from 'react';
import VideoPlayer from '@/components/portfolio/video-player';

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
    
    // Add more specific logging for self-hosted videos
    if (videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      console.log("Self-hosted video detected:", videoUrl);
      
      // Try to fetch video headers to check if URL is accessible
      fetch(videoUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log("Video URL is accessible:", response.status, response.statusText);
            console.log("Content-Type:", response.headers.get('Content-Type'));
          } else {
            console.warn("Video URL may not be accessible:", response.status, response.statusText);
          }
        })
        .catch(error => {
          console.error("Error checking video URL:", error);
        });
    }
  }, [videoUrl, thumbnail, title, isVertical]);
  
  // Default thumbnail if none provided or if the provided one is invalid
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail && thumbnail.length > 0 ? thumbnail : fallbackThumbnail;
  
  // Ensure video URL is valid
  const effectiveVideoUrl = videoUrl && videoUrl.length > 0 ? videoUrl : '';
  
  if (!effectiveVideoUrl) {
    console.warn("Missing video URL for:", title);
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
