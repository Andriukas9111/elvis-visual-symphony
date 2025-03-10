
import React from 'react';
import VideoPlayer from '@/components/portfolio/video-player';

// Forward all props to the actual VideoPlayer component
const VideoPlayerWrapper: React.FC<React.ComponentProps<typeof VideoPlayer>> = (props) => {
  // Pass all props directly to the actual VideoPlayer component
  return <VideoPlayer {...props} />;
};

export default VideoPlayerWrapper;
