
import { useEffect, RefObject, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { chunkLoader, ChunkLoadingError } from '@/utils/upload/chunks/chunkLoader';
import { bufferingManager, BufferingState } from '@/utils/upload/chunks/bufferingManager';

export function useChunkBuffering(
  videoRef: RefObject<HTMLVideoElement>,
  nextChunkRef: RefObject<HTMLVideoElement>,
  chunkUrls: string[],
  currentChunk: number,
  isPaused: boolean,
  preBufferedRef: React.MutableRefObject<boolean>
) {
  const [bufferingState, setBufferingState] = useState<BufferingState>({
    isBuffering: false,
    progress: 0,
    currentChunk: currentChunk,
    isPreBuffering: false,
    preBufferedChunk: null
  });

  // Reset buffering state when changing chunks
  useEffect(() => {
    setBufferingState(prev => ({
      ...prev,
      currentChunk,
      isPreBuffering: false,
      preBufferedChunk: null
    }));
    preBufferedRef.current = false;
  }, [currentChunk, preBufferedRef]);

  // Handle pre-buffering of next chunk
  const preBufferNextChunk = useCallback(async (nextChunkIndex: number) => {
    if (!nextChunkRef.current || nextChunkIndex >= chunkUrls.length) return;
    
    try {
      setBufferingState(prev => ({
        ...prev,
        isPreBuffering: true,
        progress: 0
      }));

      // Extract bucket and path from URL
      const url = new URL(chunkUrls[nextChunkIndex]);
      const pathParts = url.pathname.split('/');
      const bucket = pathParts[2];
      const chunkPath = pathParts.slice(3).join('/');

      // Load the chunk
      const result = await chunkLoader.loadChunk(bucket, chunkPath, nextChunkIndex);
      
      if (result.error) {
        throw result.error;
      }

      // Set the source and prepare video element
      const videoElement = nextChunkRef.current;
      videoElement.src = result.url;
      
      const onCanPlayThrough = () => {
        console.log(`Next chunk (${nextChunkIndex + 1}) preloaded successfully`);
        preBufferedRef.current = true;
        setBufferingState(prev => ({
          ...prev,
          isPreBuffering: false,
          progress: 100,
          preBufferedChunk: nextChunkIndex
        }));
      };

      const onError = () => {
        const error = videoElement.error;
        console.error(`Error pre-buffering chunk ${nextChunkIndex + 1}:`, error);
        
        preBufferedRef.current = false;
        setBufferingState(prev => ({
          ...prev,
          isPreBuffering: false,
          progress: 0,
          preBufferedChunk: null
        }));

        toast({
          title: "Video Buffering Issue",
          description: `Failed to pre-buffer chunk ${nextChunkIndex + 1}. Playback may stutter.`,
          variant: "destructive"
        });
      };

      videoElement.addEventListener('canplaythrough', onCanPlayThrough);
      videoElement.addEventListener('error', onError);
      videoElement.load();

      return () => {
        videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
        videoElement.removeEventListener('error', onError);
      };
    } catch (error) {
      console.error('Pre-buffering error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Video Buffering Error",
        description: `Failed to pre-buffer next chunk: ${message}`,
        variant: "destructive"
      });
    }
  }, [chunkUrls, nextChunkRef, preBufferedRef]);

  // Monitor current playback and trigger pre-buffering
  useEffect(() => {
    if (!videoRef.current || !chunkUrls.length || isPaused) return;

    const handleTimeUpdate = () => {
      const videoElement = videoRef.current;
      if (!videoElement || preBufferedRef.current) return;

      const shouldPreBuffer = bufferingManager.shouldStartPreBuffering(
        videoElement.currentTime,
        videoElement.duration,
        preBufferedRef.current
      );

      if (shouldPreBuffer) {
        const nextChunkIndex = currentChunk + 1;
        if (nextChunkIndex < chunkUrls.length) {
          preBufferNextChunk(nextChunkIndex);
        }
      }
    };

    const handleProgress = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const progress = bufferingManager.calculateBufferProgress(
        videoElement.buffered,
        videoElement.duration
      );

      setBufferingState(prev => ({
        ...prev,
        progress
      }));
    };

    videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    videoRef.current.addEventListener('progress', handleProgress);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('progress', handleProgress);
      }
    };
  }, [videoRef, chunkUrls, currentChunk, isPaused, preBufferedRef, preBufferNextChunk]);

  return { bufferingState };
}
