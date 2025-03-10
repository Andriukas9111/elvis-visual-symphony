
import React from 'react';
import VideoPlayerContainer from './video-player/VideoPlayerContainer';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  isVertical?: boolean;
  onPlay?: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  isVertical = false,
  onPlay,
  className = ''
}) => {
  // This is a simple wrapper around VideoPlayerContainer
  // that can be easily imported from anywhere in the app
  return (
    <VideoPlayerContainer
      videoUrl={videoUrl}
      thumbnailUrl={thumbnailUrl}
      title={title}
      isVertical={isVertical}
      onPlay={onPlay}
      className={className}
    />
  );
};

export default VideoPlayer;
