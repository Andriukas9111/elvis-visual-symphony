
import React from 'react';

interface VideoElementProps {
  videoUrl: string;
  ref: React.RefObject<HTMLVideoElement>;
}

const VideoElement: React.FC<VideoElementProps> = React.forwardRef<HTMLVideoElement, Omit<VideoElementProps, 'ref'>>((
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
