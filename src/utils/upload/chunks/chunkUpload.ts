
import { supabase } from '@/lib/supabase';

/**
 * Uploads a single chunk to Supabase storage with retry capabilities
 */
export async function uploadChunk(
  chunk: File,
  chunkFileName: string,
  bucket: string,
  contentType: string,
  chunkIndex: number,
  totalChunks: number
): Promise<string> {
  let retries = 0;
  const maxRetries = 3;
  let uploadSuccess = false;
  let lastError = null;
  
  // Ensure content type is set correctly - this is the critical fix
  if (chunk.type !== contentType) {
    console.warn(`Chunk file has unexpected content type: ${chunk.type}, expected: ${contentType}. Fixing...`);
    chunk = new File([chunk], chunk.name, { type: contentType });
  }
  
  while (retries < maxRetries && !uploadSuccess) {
    try {
      console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks} (${(chunk.size / (1024 * 1024)).toFixed(2)}MB) with content type: ${contentType}`);
      
      // Explicitly provide content type in the upload options
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(chunkFileName, chunk, {
          contentType: contentType, // Explicitly set the content type
          cacheControl: '3600',
          upsert: true,
        });
        
      if (error) {
        console.error(`Error uploading chunk ${chunkIndex + 1}/${totalChunks}:`, error);
        lastError = error;
        retries++;
        
        if (retries < maxRetries) {
          console.log(`Retrying chunk ${chunkIndex + 1} (Attempt ${retries + 1}/${maxRetries})...`);
          // Wait before retrying (increasing delay for each retry)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      } else {
        // Chunk uploaded successfully
        uploadSuccess = true;
        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`);
        return chunkFileName;
      }
    } catch (e) {
      console.error(`Exception during chunk ${chunkIndex + 1} upload:`, e);
      lastError = e;
      retries++;
      
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
  }
  
  // If upload still failed after all retries
  if (!uploadSuccess) {
    throw lastError || new Error(`Failed to upload chunk ${chunkIndex + 1} after ${maxRetries} attempts`);
  }
  
  return chunkFileName;
}
