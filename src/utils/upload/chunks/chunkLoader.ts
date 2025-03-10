
import { supabase } from '@/lib/supabase';

export interface ChunkLoadingError {
  code: number;
  message: string;
  chunkIndex: number;
  retryCount?: number;
}

export interface ChunkLoadingProgress {
  chunkIndex: number;
  progress: number;
  loaded: number;
  total: number;
}

export interface ChunkLoadingResult {
  url: string;
  duration?: number;
  error?: ChunkLoadingError;
}

export class ChunkLoader {
  private maxRetries = 3;
  private retryDelay = 1000;

  async loadChunk(
    bucket: string,
    chunkPath: string,
    chunkIndex: number,
    onProgress?: (progress: ChunkLoadingProgress) => void
  ): Promise<ChunkLoadingResult> {
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      try {
        console.log(`Loading chunk ${chunkIndex + 1} from ${bucket}/${chunkPath}`);
        
        // Get a signed URL with a longer expiry
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(chunkPath, 3600); // 1 hour expiry
          
        if (urlError || !urlData?.signedUrl) {
          throw new Error(`Failed to get signed URL for chunk ${chunkIndex + 1}: ${urlError?.message || 'No URL returned'}`);
        }
        
        // Pre-validate the chunk URL
        const validateResponse = await fetch(urlData.signedUrl, { method: 'HEAD' });
        if (!validateResponse.ok) {
          throw new Error(`Chunk ${chunkIndex + 1} URL validation failed: ${validateResponse.status}`);
        }
        
        return { url: urlData.signedUrl };
      } catch (error) {
        console.error(`Error loading chunk ${chunkIndex + 1} (attempt ${retryCount + 1}/${this.maxRetries}):`, error);
        
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
            message: error instanceof Error ? error.message : 'Failed to load chunk',
            chunkIndex,
            retryCount
          }
        };
      }
    }
    
    // This should never be reached due to the while loop, but TypeScript needs it
    return { url: '', error: { code: 4, message: 'Maximum retries exceeded', chunkIndex } };
  }
}

export const chunkLoader = new ChunkLoader();
