
import { useState, useEffect } from 'react';
import { getChunkedVideo, getChunkUrls } from '@/utils/upload/mediaDatabase';
import { VideoErrorType } from '@/components/portfolio/video-player/utils';
import { UseChunkedVideoProps } from './types';

export function useVideoFetching(
  videoId: string, 
  onError?: UseChunkedVideoProps['onError']
) {
  const [status, setStatus] = useState<'loading' | 'buffering' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [chunkData, setChunkData] = useState<any>(null);
  const [chunkUrls, setChunkUrls] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const fetchChunkedVideo = async () => {
      try {
        console.log('Fetching chunked video metadata for ID:', videoId);
        setStatus('loading');
        
        const data = await getChunkedVideo(videoId);
        if (!data) {
          throw new Error('Video not found');
        }
        
        console.log('Chunked video data:', data);
        setChunkData(data);
        
        const urls = await getChunkUrls(data.chunk_files, data.storage_bucket);
        console.log(`Got ${urls.length} chunk URLs`);
        
        if (!urls || urls.length === 0) {
          throw new Error('Could not retrieve video chunks');
        }
        
        setChunkUrls(urls);
        setStatus('ready');
        setLoadingProgress(100);
      } catch (error) {
        console.error('Error loading chunked video:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to load video');
        
        if (onError) {
          onError({
            type: VideoErrorType.LOAD,
            message: error.message || 'Failed to load chunked video',
            timestamp: Date.now()
          });
        }
      }
    };

    if (videoId) {
      fetchChunkedVideo();
    }
  }, [videoId, onError]);

  return {
    status,
    errorMessage,
    chunkData,
    chunkUrls,
    loadingProgress,
    setStatus
  };
}
