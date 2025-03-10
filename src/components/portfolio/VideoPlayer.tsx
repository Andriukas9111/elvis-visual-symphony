
import React from 'react';
import VideoPlayer from '@/components/shared/VideoPlayer';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

const PortfolioVideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  thumbnail, 
  title, 
  isVertical = false,
  onPlay,
  hideOverlayText = true
}) => {
  const handlePlayVideo = () => {
    console.log("Portfolio video playing:", title);
    if (onPlay) onPlay();
  };
  
  if (!videoUrl) {
    console.warn("Missing video URL for:", title);
    return (
      <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
        <p className="text-white/70">No video source available</p>
      </div>
    );
  }
  
  return (
    <VideoPlayer 
      videoUrl={videoUrl}
      thumbnailUrl={thumbnail}
      title={title}
      isVertical={isVertical}
      onPlay={handlePlayVideo}
      className="rounded-xl"
    />
  );
};

export default PortfolioVideoPlayer;
