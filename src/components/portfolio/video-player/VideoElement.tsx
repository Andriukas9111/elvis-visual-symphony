
import React, { useEffect } from 'react';

interface VideoElementProps {
  videoUrl: string;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>((
  { videoUrl },
  ref
) => {
  useEffect(() => {
    console.log("VideoElement rendering with URL:", videoUrl);
  }, [videoUrl]);
  
  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover"
      src={videoUrl}
      autoPlay
      controls
      playsInline
    />
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
