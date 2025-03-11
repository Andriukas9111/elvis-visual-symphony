
import React from 'react';

interface VideoContentProps {
  isVisible: boolean;
  children: React.ReactNode;
  togglePlay?: () => void;
  // Add optional props to match what's being passed in index.tsx
  videoId?: string;
  actualVideoUrl?: string;
  title?: string;
  isYoutubeShort?: boolean;
  videoRef?: React.MutableRefObject<HTMLIFrameElement | HTMLVideoElement | null>;
  handleVideoError?: (errorMessage: string) => void;
}

const VideoContent: React.FC<VideoContentProps> = ({
  isVisible,
  togglePlay,
  children,
  // No need to use these props in the component, just allow them to be passed
  videoId,
  actualVideoUrl,
  title,
  isYoutubeShort,
  videoRef,
  handleVideoError
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
