
import React from 'react';
import VideoPlayer from '@/components/portfolio/video-player';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  playButtonSize?: 'sm' | 'md' | 'lg';
  customPlayButton?: React.ReactNode;
  className?: string;
}

const VideoPlayerWrapper: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = true, // Keep title hidden by default
  playButtonSize,
  customPlayButton,
  className
}) => {
  // Enhanced debugging
  console.log("VideoPlayerWrapper rendering with:", { 
    videoUrl, 
    thumbnail, 
    title, 
    isVertical,
    thumbnailValid: !!thumbnail && thumbnail.length > 0,
    videoUrlValid: !!videoUrl && videoUrl.length > 0
  });
  
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
      playButtonSize={playButtonSize}
      customPlayButton={customPlayButton}
      className={className}
    />
  );
};

export default VideoPlayerWrapper;
