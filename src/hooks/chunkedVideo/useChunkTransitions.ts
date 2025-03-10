
import { useEffect, RefObject } from 'react';

export function useChunkTransitions(
  videoRef: RefObject<HTMLVideoElement>,
  nextChunkRef: RefObject<HTMLVideoElement>,
  chunkUrls: string[],
  currentChunk: number,
  isPaused: boolean
) {
  // Effect for handling chunk changes
  useEffect(() => {
    if (videoRef.current && chunkUrls.length > 0 && currentChunk < chunkUrls.length) {
      // If the next chunk was pre-buffered and we have a valid nextChunkRef
      if (currentChunk > 0 && nextChunkRef.current && nextChunkRef.current.src) {
        console.log(`Switching to pre-buffered chunk ${currentChunk + 1}`);
        
        // Swap the current video reference with the pre-buffered one
        const tempSrc = videoRef.current.src;
        const tempVolume = videoRef.current.volume;
        const tempMuted = videoRef.current.muted;
        
        videoRef.current.src = nextChunkRef.current.src;
        nextChunkRef.current.src = '';
        
        // Ensure volume settings are maintained
        videoRef.current.volume = tempVolume;
        videoRef.current.muted = tempMuted;
      } else {
        // If no pre-buffering, just set the source directly
        videoRef.current.src = chunkUrls[currentChunk];
      }
      
      if (!isPaused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error('Error playing next chunk:', e);
          });
        }
      }
    }
  }, [currentChunk, chunkUrls, isPaused, videoRef, nextChunkRef]);
}
