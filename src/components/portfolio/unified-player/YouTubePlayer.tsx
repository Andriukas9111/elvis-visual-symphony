import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { extractYouTubeId } from './utils';

// Define YouTube player states with the missing UNSTARTED constant
const YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

interface YouTubePlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  isVertical?: boolean;
  onPlay?: () => void;
  hideOverlayText?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onError?: (error: any) => void;
  initialVolume?: number;
  startAt?: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  thumbnail,
  title,
  isVertical = false,
  onPlay,
  hideOverlayText = true,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  onError,
  initialVolume = 0.7,
  startAt = 0
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const { prefersReducedMotion } = useAnimation();
  
  const videoId = extractYouTubeId(videoUrl);
  
  const handlePlay = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsPlaying(true);
    
    if (onPlay) {
      onPlay();
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
  }, [autoPlay]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-elvis-darker`}>
      {!isPlaying && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer group"
          onClick={handlePlay}
        >
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg'; 
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center bg-elvis-dark/40 transition-opacity group-hover:bg-elvis-dark/60">
            {isLoading ? (
              <motion.div 
                className="rounded-full bg-elvis-pink/90 p-4 shadow-lg shadow-elvis-pink/30"
                animate={{ scale: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                className="rounded-full bg-elvis-pink/90 p-4 shadow-lg shadow-elvis-pink/30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Play className="w-8 h-8 text-white fill-current" />
              </motion.div>
            )}
          </div>
          
          {!hideOverlayText && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium">{title}</h3>
            </div>
          )}
        </div>
      )}

      {isPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0${startAt ? `&start=${startAt}` : ''}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={title}
          onError={(e) => {
            console.error("YouTube iframe error", e);
            if (onError) {
              onError({
                type: "YOUTUBE_ERROR",
                message: "Failed to load YouTube video",
                details: e,
                timestamp: Date.now()
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default YouTubePlayer;
