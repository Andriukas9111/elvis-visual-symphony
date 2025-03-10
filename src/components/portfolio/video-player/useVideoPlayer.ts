
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseVideoPlayerProps {
  videoUrl: string;
  onPlay?: () => void;
}

export const useVideoPlayer = ({ videoUrl, onPlay }: UseVideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement | HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Is it a YouTube video?
  const isYoutubeVideo = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
  const isYoutubeShort = isYoutubeVideo && videoUrl?.includes('/shorts/');
  
  // Reset playing state when videoUrl changes
  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setError(null);
  }, [videoUrl]);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Debug logging
  useEffect(() => {
    console.log("VideoPlayer state:", { 
      videoUrl,
      isYoutubeVideo,
      isYoutubeShort,
      playing,
      loading,
      fullscreen,
      error
    });
  }, [videoUrl, isYoutubeVideo, isYoutubeShort, playing, loading, fullscreen, error]);
  
  const togglePlay = () => {
    console.log("Toggling play state. Current state:", playing);
    
    if (error) {
      setError(null);
    }
    
    // For direct videos (non-YouTube)
    if (!isYoutubeVideo && videoRef.current && 'play' in videoRef.current) {
      try {
        const videoElement = videoRef.current as HTMLVideoElement;
        
        if (!playing) {
          console.log("Attempting to play video:", videoUrl);
          setLoading(true);
          
          // Make sure the video is loaded
          if (videoElement.readyState === 0) {
            console.log("Video not loaded yet, loading first");
            videoElement.load();
          }
          
          const playPromise = videoElement.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video playback started successfully for:", videoUrl);
                setPlaying(true);
                setLoading(false);
                if (onPlay) onPlay();
              })
              .catch(err => {
                console.error("Error starting video playback:", err);
                setPlaying(false);
                setLoading(false);
                setError(`Failed to play video: ${err.message || "Unknown error"}`);
                toast({
                  title: "Video Error",
                  description: "Failed to start video playback. Please try again.",
                  variant: "destructive"
                });
              });
          }
        } else {
          console.log("Pausing video");
          videoElement.pause();
          setPlaying(false);
        }
      } catch (err) {
        console.error('Error playing/pausing video:', err);
        setPlaying(false);
        setLoading(false);
        setError(`Error with video playback: ${(err as Error).message}`);
      }
    } else {
      // For YouTube or other cases where we don't control the video element directly
      setPlaying(!playing);
      if (!playing && onPlay) {
        onPlay();
      }
    }
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (fullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    } else if (playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch(err => 
        console.error('Error requesting fullscreen:', err)
      );
    }
  };
  
  const closeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Explicitly pause the video if it's a direct video
    if (!isYoutubeVideo && videoRef.current && 'play' in videoRef.current) {
      try {
        (videoRef.current as HTMLVideoElement).pause();
      } catch (err) {
        console.error('Error pausing video:', err);
      }
    }
    
    setPlaying(false);
    
    if (fullscreen) {
      document.exitFullscreen().catch(err => console.error('Error exiting fullscreen:', err));
    }
  };
  
  const skipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && 'currentTime' in videoRef.current) {
      try {
        const videoElement = videoRef.current as HTMLVideoElement;
        videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
      } catch (err) {
        console.error('Error skipping backward:', err);
      }
    }
  };
  
  const skipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && 'currentTime' in videoRef.current) {
      try {
        const videoElement = videoRef.current as HTMLVideoElement;
        videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10);
      } catch (err) {
        console.error('Error skipping forward:', err);
      }
    }
  };
  
  const handleVideoError = (errorMessage: string) => {
    console.error("Video error:", errorMessage);
    setError(errorMessage);
    setPlaying(false);
    setLoading(false);
    toast({
      title: "Video Error",
      description: "Failed to load video. Please try again later.",
      variant: "destructive"
    });
  };
  
  return {
    playing,
    loading,
    fullscreen,
    error,
    videoRef,
    playerContainerRef,
    isYoutubeVideo,
    isYoutubeShort,
    togglePlay,
    toggleFullscreen,
    closeVideo,
    skipBackward,
    skipForward,
    handleVideoError
  };
};
