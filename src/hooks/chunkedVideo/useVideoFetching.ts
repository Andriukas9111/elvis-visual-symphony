
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoErrorType, VideoErrorData } from '@/components/portfolio/video-player/utils';

interface ChunkedVideoData {
  id: string;
  title?: string;
  chunk_files: string[];
  chunk_count: number;
  metadata?: any;
}

export const useVideoFetching = () => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<VideoErrorData | null>(null);
  const [chunkData, setChunkData] = useState<ChunkedVideoData | null>(null);
  const [chunkUrls, setChunkUrls] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fetchVideo = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setVideoSrc('');
      setChunkData(null);
      setChunkUrls([]);
      setLoadingProgress(0);
      
      // For testing, we'll just set the video source directly
      // In a real implementation, this would fetch chunk data and URLs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVideoSrc(url);
      setLoadingProgress(100);
    } catch (err) {
      console.error('Error fetching video:', err);
      setError({
        type: VideoErrorType.LOAD,
        message: err instanceof Error ? err.message : 'Failed to load video',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    videoSrc,
    isLoading,
    error,
    chunkData,
    chunkUrls,
    loadingProgress,
    fetchVideo
  };
};
