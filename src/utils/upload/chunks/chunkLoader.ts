
import { supabase } from '@/lib/supabase';

export interface VideoLoadingError {
  code: number;
  message: string;
  retryCount?: number;
}

export interface VideoLoadingProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface VideoLoadingResult {
  url: string;
  duration?: number;
  error?: VideoLoadingError;
}

export class VideoLoader {
  private maxRetries = 3;
  private retryDelay = 1000;

  async loadVideo(
    bucket: string,
    filePath: string,
    onProgress?: (progress: VideoLoadingProgress) => void
  ): Promise<VideoLoadingResult> {
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      try {
        console.log(`Loading video from ${bucket}/${filePath}`);
        
        // Get a signed URL with a longer expiry (1 hour)
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 3600);
          
        if (urlError || !urlData?.signedUrl) {
          throw new Error(`Failed to get signed URL: ${urlError?.message || 'No URL returned'}`);
        }
        
        // Pre-validate the video URL
        const validateResponse = await fetch(urlData.signedUrl, { method: 'HEAD' });
        if (!validateResponse.ok) {
          throw new Error(`Video URL validation failed: ${validateResponse.status}`);
        }
        
        return { url: urlData.signedUrl };
      } catch (error) {
        console.error(`Error loading video (attempt ${retryCount + 1}/${this.maxRetries}):`, error);
        
        retryCount++;
        if (retryCount < this.maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, retryCount - 1)));
          continue;
        }
        
        return {
          url: '',
          error: {
            code: 4, // Media error code for loading failure
            message: error instanceof Error ? error.message : 'Failed to load video',
            retryCount
          }
        };
      }
    }
    
    // This should never be reached due to the while loop, but TypeScript needs it
    return { url: '', error: { code: 4, message: 'Maximum retries exceeded' } };
  }
}

export const videoLoader = new VideoLoader();
