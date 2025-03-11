
import { useEffect, RefObject } from 'react';
import { toast } from '@/components/ui/use-toast';
import { videoLoader } from '@/utils/upload/chunks/chunkLoader';

export function useChunkTransitions(
  videoRef: RefObject<HTMLVideoElement>,
  videoUrl: string,
  isPaused: boolean
) {
  useEffect(() => {
    if (!videoRef.current || !videoUrl) {
      return;
    }

    const loadVideo = async () => {
      try {
        console.log(`Setting up video playback from URL: ${videoUrl}`);
        
        // Extract bucket and path from URL
        const url = new URL(videoUrl);
        const pathParts = url.pathname.split('/');
        const bucket = pathParts[2];
        const filePath = pathParts.slice(3).join('/');

        // Load the video
        const result = await videoLoader.loadVideo(bucket, filePath);
        
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
                console.error('Error playing video:', e);
                toast({
                  title: "Playback Error",
                  description: "Failed to play video. Please try again.",
                  variant: "destructive"
                });
              });
            }
          }
        }
      } catch (error) {
        console.error('Error during video loading:', error);
        toast({
          title: "Video Playback Error",
          description: `Failed to load video. Please try refreshing the page.`,
          variant: "destructive"
        });
      }
    };

    loadVideo();
  }, [videoUrl, isPaused, videoRef]);
}

// Re-export renamed function to maintain backward compatibility
export const useVideoTransitions = useChunkTransitions;

