
import React, { useState, useEffect } from 'react';
import { isYoutubeUrl } from '../video-player/utils';
import YouTubePlayer from '../video-player/YouTubePlayer';
import ChunkedVideoPlayer from '../video-player/ChunkedVideoPlayer';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface UnifiedVideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
}

const UnifiedVideoPlayer: React.FC<UnifiedVideoPlayerProps> = ({ videoUrl, thumbnail, title }) => {
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    setIsYouTube(isYoutubeUrl(videoUrl));
  }, [videoUrl]);

  if (isYouTube) {
    return (
      <AspectRatio ratio={16 / 9}>
        <YouTubePlayer 
          videoUrl={videoUrl}
          thumbnail={thumbnail}
          title={title}
        />
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <ChunkedVideoPlayer
        videoId={videoUrl}
        thumbnail={thumbnail}
        title={title}
      />
    </AspectRatio>
  );
};

export default UnifiedVideoPlayer;
