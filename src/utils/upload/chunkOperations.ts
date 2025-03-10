
import { supabase } from '@/lib/supabase';

/**
 * Creates a new chunk file from the original file's blob
 */
export function createChunkFile(
  chunkBlob: Blob,
  chunkIndex: number,
  totalChunks: number,
  fileExtension: string,
  contentType: string
): File {
  const chunkFileName = `chunk-${chunkIndex}.${fileExtension}`;
  return new File([chunkBlob], chunkFileName, {
    type: contentType
  });
}

/**
 * Generates a unique filename for a specific chunk
 */
export function generateChunkFileName(
  fileNameBase: string,
  chunkIndex: number,
  totalChunks: number,
  fileExtension: string
): string {
  return `${fileNameBase}_chunk_${chunkIndex}_of_${totalChunks}.${fileExtension}`;
}

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

/**
 * Stores metadata about a chunked upload in the database
 */
export async function storeChunkedUploadMetadata(
  file: File,
  fileNameBase: string,
  bucket: string,
  chunkPaths: string[],
  totalChunks: number,
  chunkSize: number,
  contentType: string
): Promise<{ videoId: string; videoUrl: string }> {
  // Create a unique reference ID for this chunked upload
  const chunkUploadId = fileNameBase.split('/').pop();
  
  // Create database entry for this chunked upload
  const { data, error } = await supabase
    .from('chunked_uploads')
    .upsert({
      id: chunkUploadId,
      original_filename: file.name,
      file_size: file.size,
      mime_type: contentType,
      total_chunks: totalChunks,
      chunk_size: chunkSize,
      chunk_files: chunkPaths,
      storage_bucket: bucket,
      base_path: fileNameBase,
      status: 'complete',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating metadata database entry:', error);
    throw error;
  }
  
  // Create a virtual URL that will be handled by our playback system
  const videoId = data.id;
  const videoUrl = `/api/video/${videoId}`;
  
  return { videoId, videoUrl };
}

/**
 * Creates a HLS-like manifest for chunked video playback
 * This simulates an HLS manifest by returning chunk information
 */
export async function createStreamingManifest(
  videoId: string,
  expirySeconds: number = 86400 // 24 hours by default
): Promise<{ manifestUrl: string; chunks: string[] }> {
  try {
    // Get the chunked video data
    const { data: videoData, error } = await supabase
      .from('chunked_uploads')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!videoData) {
      throw new Error('Video not found');
    }
    
    // Generate signed URLs for all chunks with a long expiry
    const signedUrls = await Promise.all(
      videoData.chunk_files.map(async (chunkPath: string) => {
        const { data } = await supabase.storage
          .from(videoData.storage_bucket)
          .createSignedUrl(chunkPath, expirySeconds);
          
        return data?.signedUrl;
      })
    );
    
    const validUrls = signedUrls.filter(Boolean) as string[];
    
    // For a real HLS implementation, we would create an m3u8 file here
    // But for our purposes, we'll just track the chunks for sequential playback
    
    // Store the manifest reference in the database
    const manifestId = `manifest-${videoId}-${Date.now()}`;
    
    // Return the manifest URL (in a real implementation, this would be a file URL)
    return {
      manifestUrl: `/api/stream/${videoId}`,
      chunks: validUrls
    };
  } catch (error) {
    console.error('Error creating streaming manifest:', error);
    throw error;
  }
}

/**
 * Cleans up chunks from storage if an error occurs
 */
export async function cleanupChunks(bucket: string, chunkPaths: string[]): Promise<void> {
  try {
    console.log('Cleaning up uploaded chunks after error...');
    for (const chunkPath of chunkPaths) {
      await supabase.storage.from(bucket).remove([chunkPath]);
    }
  } catch (cleanupError) {
    console.error('Error cleaning up chunks:', cleanupError);
    // Don't throw here, as we're likely already handling another error
  }
}
