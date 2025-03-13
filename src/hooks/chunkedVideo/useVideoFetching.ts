
import { useState, useEffect, useCallback } from 'react';
import { VideoErrorType, VideoErrorData } from '@/components/portfolio/video-player/utils';

interface UseVideoFetchingProps {
  videoUrl: string | null;
  onError?: (error: VideoErrorData) => void;
}

export const useVideoFetching = ({ 
  videoUrl, 
  onError 
}: UseVideoFetchingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  const fetchVideo = useCallback(async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    
    try {
      // Check if the URL is valid
      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
      }
      
      // If successful, set the video source
      setVideoSrc(url);
    } catch (error) {
      console.error('Error fetching video:', error);
      
      // Call the error handler with appropriate error info
      if (onError) {
        onError({
          type: VideoErrorType.LOAD,
          message: error instanceof Error ? error.message : 'Failed to load video',
          timestamp: Date.now()
        });
      }
      
      // Clear the video source
      setVideoSrc(null);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);
  
  // Fetch the video when the URL changes
  useEffect(() => {
    setVideoSrc(null);
    
    if (videoUrl) {
      fetchVideo(videoUrl);
    }
  }, [videoUrl, fetchVideo]);
  
  return {
    videoSrc,
    isLoading,
    fetchVideo
  };
};
