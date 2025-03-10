
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
    if (!videoRef.current || chunkUrls.length === 0 || currentChunk >= chunkUrls.length) {
      return;
    }

    console.log(`Setting up chunk ${currentChunk + 1}/${chunkUrls.length}`);
    
    // Always set the source directly for the current chunk to ensure reliability
    videoRef.current.src = chunkUrls[currentChunk];
    
    // Load the video element to prepare it
    videoRef.current.load();
    
    // Play the video if it's not paused
    if (!isPaused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error('Error playing chunk:', e);
        });
      }
    }
  }, [currentChunk, chunkUrls, isPaused, videoRef, nextChunkRef]);
}
