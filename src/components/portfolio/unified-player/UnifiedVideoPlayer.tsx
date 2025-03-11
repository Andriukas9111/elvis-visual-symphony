import React, { useState, useRef, useEffect } from 'react';
import { isYoutubeUrl } from '../video-player/utils';
import YouTubePlayer from '../video-player/YouTubePlayer';
import ChunkedVideoPlayer from '../video-player/ChunkedVideoPlayer';
import { AspectRatio } from "@/components/ui/aspect-ratio"

const UnifiedVideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const [isYouTube, setIsYouTube] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsYouTube(isYoutubeUrl(videoUrl));
  }, [videoUrl]);

  return (
    <AspectRatio ratio={16 / 9}>
      {isYouTube ? (
        <YouTubePlayer videoUrl={videoUrl} />
      ) : (
        <ChunkedVideoPlayer videoUrl={videoUrl} />
      )}
    </AspectRatio>
  );
};

export default UnifiedVideoPlayer;
