
import React from 'react';
import ActualVideoPlayer from '@/components/portfolio/video-player';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
}

// Create a proper component that correctly forwards all props to the actual VideoPlayer
const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  // Pass all props directly to the actual VideoPlayer component
  return <ActualVideoPlayer {...props} />;
};

export default VideoPlayer;
