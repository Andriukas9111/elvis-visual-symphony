
import React from 'react';

interface VideoContentProps {
  isVisible: boolean;
  togglePlay?: () => void;
  children: React.ReactNode;
}

const VideoContent: React.FC<VideoContentProps> = ({
  isVisible,
  togglePlay,
  children
}) => {
  return (
    <div 
      className={`absolute inset-0 ${isVisible ? 'block' : 'hidden'}`}
      onClick={togglePlay}
    >
      {children}
    </div>
  );
};

export default VideoContent;
