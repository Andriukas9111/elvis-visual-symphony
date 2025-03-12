
import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2, Play } from 'lucide-react';

export interface VideoErrorData {
  message: string;
  code?: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  isVertical?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onError?: (error: VideoErrorData) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail = '/placeholder.svg',
  title = 'Video',
  autoPlay = false,
  muted = true,
  controls = true,
  isVertical = false,
  loop = false,
  onPlay,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Handle auto-play if specified
    if (autoPlay && videoRef.current) {
      handlePlay();
    }
  }, [autoPlay, videoUrl]);

  const handlePlay = () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setError(null);

    // Play the video
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          if (onPlay) onPlay();
        })
        .catch(err => {
          console.error('Error playing video:', err);
          setIsLoading(false);
          const errorData: VideoErrorData = {
            message: 'Failed to play video. Please try again.',
            code: err.name
          };
          setError(errorData.message);
          if (onError) onError(errorData);
        });
    }
  };

  // Handle YouTube embeds
  const isYouTubeUrl = videoUrl && 
    (videoUrl.includes('youtube.com/embed/') || 
     videoUrl.includes('youtube.com/watch') || 
     videoUrl.includes('youtu.be/'));

  if (isYouTubeUrl) {
    // Convert regular YouTube URLs to embed URLs
    let embedUrl = videoUrl;
    if (videoUrl.includes('watch?v=')) {
      const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
        <iframe
          src={`${embedUrl}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}`}
          title={title}
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </AspectRatio>
    );
  }

  // Regular video file
  return (
    <AspectRatio ratio={isVertical ? 9/16 : 16/9}>
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
        {!isPlaying && thumbnail && (
          <div className="absolute inset-0 z-10">
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={handlePlay}
              disabled={isLoading}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              ) : (
                <div className="bg-elvis-pink/90 hover:bg-elvis-pink rounded-full p-4">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              )}
            </button>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          controls={controls && isPlaying}
          muted={muted}
          loop={loop}
          onPlay={() => {
            setIsPlaying(true);
            if (onPlay) onPlay();
          }}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            const errorObj = e.currentTarget.error;
            const errorData: VideoErrorData = {
              message: errorObj ? `Error loading video: ${errorObj.message}` : 'Error loading video',
              code: errorObj ? String(errorObj.code) : undefined
            };
            setError(errorData.message);
            setIsLoading(false);
            if (onError) onError(errorData);
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadedData={() => setIsLoading(false)}
        />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-center p-4">
            <div>
              <p className="mb-2">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  if (videoRef.current) {
                    videoRef.current.load();
                    handlePlay();
                  }
                }}
                className="bg-elvis-pink hover:bg-elvis-pink-dark px-4 py-2 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </AspectRatio>
  );
};

export default VideoPlayer;
