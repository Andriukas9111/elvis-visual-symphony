
import React from 'react';
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
  hideOverlayText = false
}) => {
  // Enhanced logging with additional info for debugging
  console.log("VideoPlayerWrapper rendering with:", { 
    videoUrl, 
    thumbnail, 
    title, 
    isVertical,
    thumbnailValid: !!thumbnail && thumbnail.length > 0,
    videoUrlValid: !!videoUrl && videoUrl.length > 0
  });
  
  // Default thumbnail if none provided
  const fallbackThumbnail = '/placeholder.svg';
  const effectiveThumbnail = thumbnail?.length > 0 ? thumbnail : fallbackThumbnail;
  
  return (
    <VideoPlayer 
      videoUrl={videoUrl || ''} 
      thumbnail={effectiveThumbnail} 
      title={title}
      isVertical={isVertical} 
      onPlay={onPlay}
      hideOverlayText={hideOverlayText}
    />
  );
};

export default VideoPlayerWrapper;
