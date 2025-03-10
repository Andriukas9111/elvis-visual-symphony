
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

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  // Make sure we're correctly forwarding all props to the actual player component
  return <ActualVideoPlayer {...props} />;
};

export default VideoPlayer;
