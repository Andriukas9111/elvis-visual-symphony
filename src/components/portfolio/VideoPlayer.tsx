
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
  // Log what we're passing to the actual video player for debugging
  console.log("VideoPlayer props:", { videoUrl, thumbnail, title, isVertical, onPlay, hideOverlayText });
  
  // Make sure we're correctly forwarding all props to the actual player component
  return (
    <VideoPlayer 
      videoUrl={videoUrl} 
      thumbnail={thumbnail} 
      title={title} 
      isVertical={isVertical} 
      onPlay={onPlay}
      hideOverlayText={hideOverlayText}
    />
  );
};

export default VideoPlayerWrapper;
