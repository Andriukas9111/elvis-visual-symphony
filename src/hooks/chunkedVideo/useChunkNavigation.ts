
import { useState, useCallback, RefObject } from 'react';

interface UseChunkNavigationProps {
  chunkUrls: string[];
  loop: boolean;
  preBufferedRef: React.MutableRefObject<boolean>;
  setIsBuffering: (value: boolean) => void;
  setIsPaused: (value: boolean) => void;
}

export function useChunkNavigation({
  chunkUrls,
  loop,
  preBufferedRef,
  setIsBuffering,
  setIsPaused
}: UseChunkNavigationProps) {
  const [currentChunk, setCurrentChunk] = useState<number>(0);

  // Chunk ended handler
  const handleChunkEnded = useCallback(() => {
    console.log(`Chunk ${currentChunk + 1}/${chunkUrls.length} ended`);
    
    if (currentChunk < chunkUrls.length - 1) {
      // Move to next chunk
      console.log(`Moving to next chunk (${currentChunk + 2}/${chunkUrls.length})`);
      setCurrentChunk(prev => prev + 1);
      setIsBuffering(true);
      preBufferedRef.current = false;
    } else if (loop) {
      // Loop back to first chunk
      console.log(`Looping back to first chunk`);
      setCurrentChunk(0);
      preBufferedRef.current = false;
    } else {
      // End of playback
      console.log('End of all chunks reached');
      setIsPaused(true);
    }
  }, [currentChunk, chunkUrls.length, loop, preBufferedRef, setIsBuffering, setIsPaused]);

  return {
    currentChunk,
    setCurrentChunk,
    handleChunkEnded
  };
}
