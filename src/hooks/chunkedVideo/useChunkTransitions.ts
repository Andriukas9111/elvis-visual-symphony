
import { useEffect, RefObject } from 'react';
import { toast } from '@/components/ui/use-toast';
import { chunkLoader } from '@/utils/upload/chunks/chunkLoader';

export function useChunkTransitions(
  videoRef: RefObject<HTMLVideoElement>,
  nextChunkRef: RefObject<HTMLVideoElement>,
  chunkUrls: string[],
  currentChunk: number,
  isPaused: boolean
) {
  useEffect(() => {
    if (!videoRef.current || chunkUrls.length === 0 || currentChunk >= chunkUrls.length) {
      return;
    }

    const loadCurrentChunk = async () => {
      try {
        console.log(`Setting up chunk ${currentChunk + 1}/${chunkUrls.length}`);
        
        // Extract bucket and path from URL
        const url = new URL(chunkUrls[currentChunk]);
        const pathParts = url.pathname.split('/');
        const bucket = pathParts[2];
        const chunkPath = pathParts.slice(3).join('/');

        // Load the chunk
        const result = await chunkLoader.loadChunk(bucket, chunkPath, currentChunk);
        
        if (result.error) {
          throw result.error;
        }

        // Set up video element with the signed URL
        if (videoRef.current) {
          videoRef.current.src = result.url;
          videoRef.current.load();
          
          if (!isPaused) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                console.error('Error playing chunk:', e);
                toast({
                  title: "Playback Error",
                  description: "Failed to play video chunk. Please try again.",
                  variant: "destructive"
                });
              });
            }
          }
        }
      } catch (error) {
        console.error('Error during chunk transition:', error);
        toast({
          title: "Video Playback Error",
          description: `Failed to load chunk ${currentChunk + 1}. Please try refreshing the page.`,
          variant: "destructive"
        });
      }
    };

    loadCurrentChunk();
  }, [currentChunk, chunkUrls, isPaused, videoRef]);
}
