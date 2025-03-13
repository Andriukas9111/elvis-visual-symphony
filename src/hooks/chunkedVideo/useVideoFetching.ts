
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoErrorType, VideoErrorData } from '@/components/portfolio/video-player/utils';

interface ChunkData {
  id: string;
  chunk_files: string[];
  chunk_count: number;
  status: string;
  metadata?: any;
  title?: string;
}

interface UseVideoFetchingProps {
  videoId: string | null;
  onError?: (error: VideoErrorData) => void;
}

export const useVideoFetching = ({ videoId, onError }: UseVideoFetchingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chunkData, setChunkData] = useState<ChunkData | null>(null);
  const [chunkUrls, setChunkUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchChunkedVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(10); // Initial progress

        // Fetch video data from chunked_videos table
        const { data, error: fetchError } = await supabase
          .from('chunked_videos')
          .select('*')
          .eq('id', videoId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Video not found');
        }

        setChunkData(data);
        setProgress(50);

        // Generate signed URLs for each chunk
        const chunkFiles = data.chunk_files || [];
        const urls: string[] = [];

        for (let i = 0; i < chunkFiles.length; i++) {
          const { data: urlData } = await supabase.storage
            .from('chunks')
            .createSignedUrl(chunkFiles[i], 3600); // 1 hour expiry

          if (urlData?.signedUrl) {
            urls.push(urlData.signedUrl);
          }
          
          // Update progress as we fetch URLs
          setProgress(50 + Math.floor((i / chunkFiles.length) * 50));
        }

        setChunkUrls(urls);
        setProgress(100);
      } catch (err) {
        console.error('Error fetching chunked video:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        if (onError) {
          onError({
            type: VideoErrorType.LOAD,
            message: 'Failed to load chunked video',
            details: err,
            timestamp: Date.now()
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChunkedVideo();
  }, [videoId, onError]);

  return {
    isLoading,
    progress,
    chunkData,
    chunkUrls,
    error
  };
};
