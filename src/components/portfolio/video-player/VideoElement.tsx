
import React from 'react';

interface VideoElementProps {
  videoUrl: string;
}

const VideoElement = React.forwardRef<HTMLVideoElement, VideoElementProps>((
  { videoUrl },
  ref
) => {
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
