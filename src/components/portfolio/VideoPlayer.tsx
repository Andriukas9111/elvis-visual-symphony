
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

const VideoPlayerWrapper: React.FC<VideoPlayerProps> = (props) => {
  // Log what we're passing to the actual video player for debugging
  console.log("VideoPlayerWrapper props:", props);
  
  // Make sure we're correctly forwarding all props to the actual player component
  return <VideoPlayer {...props} />;
};

export default VideoPlayerWrapper;
