
import { useEffect, RefObject } from 'react';

export function useChunkBuffering(
  videoRef: RefObject<HTMLVideoElement>,
  nextChunkRef: RefObject<HTMLVideoElement>,
  chunkUrls: string[],
  currentChunk: number,
  isPaused: boolean,
  preBufferedRef: React.MutableRefObject<boolean>
) {
  // Pre-buffer the next chunk when the current chunk is playing
  useEffect(() => {
    const preBufferNextChunk = () => {
      if (
        chunkUrls.length > 1 && 
        currentChunk < chunkUrls.length - 1 && 
        !isPaused && 
        nextChunkRef.current && 
        !preBufferedRef.current
      ) {
        const nextChunkIndex = currentChunk + 1;
        if (nextChunkIndex < chunkUrls.length) {
          console.log(`Pre-buffering next chunk (${nextChunkIndex + 1}/${chunkUrls.length})`);
          nextChunkRef.current.src = chunkUrls[nextChunkIndex];
          nextChunkRef.current.load();
          preBufferedRef.current = true;
        }
      }
    };

    // Start pre-buffering when we're 80% through the current chunk
    const handleTimeUpdate = () => {
      if (videoRef.current && !preBufferedRef.current) {
        const videoElement = videoRef.current;
        const duration = videoElement.duration;
        const currentTime = videoElement.currentTime;
        
        // Start pre-buffering when we're 80% through the current chunk
        if (duration > 0 && currentTime / duration >= 0.8) {
          preBufferNextChunk();
        }
      }
    };

    if (videoRef.current && chunkUrls.length > 1) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [currentChunk, chunkUrls, isPaused, nextChunkRef, videoRef, preBufferedRef]);
}
