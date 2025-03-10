
import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface YoutubePlayerProps {
  videoId: string;
  title: string;
  isShort?: boolean;
  onPlay?: () => void;
  className?: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  videoId,
  title,
  isShort = false,
  onPlay,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
    if (onPlay) onPlay();
  };
  
  // Parameters for YouTube embed
  const embedParams = isShort
    ? 'autoplay=1&rel=0&controls=1&fs=1&modestbranding=1&playsinline=1'
    : 'autoplay=1&rel=0&controls=1&fs=1';
    
  const embedClass = isShort 
    ? "absolute inset-0 w-full h-full scale-[1.78]" // Scale up for vertical videos (9:16 aspect ratio)
    : "absolute inset-0 w-full h-full";

  return (
    <div className={`relative ${isShort ? 'aspect-[9/16]' : 'aspect-video'} ${className}`}>
      {isPlaying ? (
        <div className="relative w-full h-full">
          <iframe
            className={embedClass}
            src={`https://www.youtube.com/embed/${videoId}?${embedParams}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-elvis-darker z-10">
              <Loader2 className="w-8 h-8 text-elvis-pink animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button 
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30
                   hover:bg-black/40 transition-all duration-300 group"
          onClick={handlePlay}
          aria-label="Play YouTube video"
        >
          <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center
                         group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white text-sm font-medium">{title}</h3>
          </div>
        </button>
      )}
    </div>
  );
};

export default YoutubePlayer;
