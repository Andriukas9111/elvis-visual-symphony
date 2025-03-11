
import React from 'react';

interface VideoContentProps {
  isVisible: boolean;
  togglePlay: () => void;
  children: React.ReactNode;
}

const VideoContent: React.FC<VideoContentProps> = ({
  isVisible,
  togglePlay,
  children
}) => {
  if (!isVisible) return null;
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center cursor-pointer"
      onClick={togglePlay}
    >
      {children}
    </div>
  );
};

export default VideoContent;
