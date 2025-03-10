
import { supabase } from '@/lib/supabase';

// Size of each chunk in bytes (5MB)
const CHUNK_SIZE = 5 * 1024 * 1024;

/**
 * Uploads a large file in chunks to avoid storage size limits
 */
export async function uploadLargeFile(
  file: File,
  filePath: string,
  bucket: string,
  contentType: string,
  onProgressUpdate: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> {
  console.log(`Starting chunked upload for ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
  
  // For very large files, we'll use a different approach:
  // 1. Split the original filename to generate chunk filenames
  const fileNameParts = filePath.split('.');
  const fileNameBase = fileNameParts.slice(0, -1).join('.');
  const fileExtension = fileNameParts.pop();
  
  // Calculate the total number of chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  console.log(`File will be split into ${totalChunks} chunks of ${CHUNK_SIZE / (1024 * 1024)}MB each`);
  
  // Array to store uploaded chunk paths
  const chunkPaths = [];
  let lastReportedProgress = 0;
  
  try {
    // Upload each chunk with retry logic
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);
      
      // Generate a unique chunk filename
      const chunkFileName = `${fileNameBase}_chunk_${chunkIndex}_of_${totalChunks}.${fileExtension}`;
      
      // Try uploading this chunk with retries
      let retries = 0;
      const maxRetries = 3;
      let uploadSuccess = false;
      let lastError = null;
      
      while (retries < maxRetries && !uploadSuccess) {
        try {
          console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks} (${(chunkBlob.size / (1024 * 1024)).toFixed(2)}MB)`);
          
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(chunkFileName, chunkBlob, {
              contentType: contentType,
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
            chunkPaths.push(chunkFileName);
            console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`);
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
      
      // If the chunk upload still failed after all retries, throw error
      if (!uploadSuccess) {
        throw lastError || new Error(`Failed to upload chunk ${chunkIndex + 1} after ${maxRetries} attempts`);
      }
      
      // Update progress (ensure we report distinct progress values to avoid UI flicker)
      const currentProgress = Math.round((chunkIndex + 1) / totalChunks * 90); // Save 10% for finalizing
      if (currentProgress > lastReportedProgress) {
        onProgressUpdate(currentProgress);
        lastReportedProgress = currentProgress;
      }
    }
    
    // Generate metadata file with information about chunks
    const metadata = {
      originalFileName: file.name,
      originalFileSize: file.size,
      mimeType: contentType,
      totalChunks: totalChunks,
      chunkSize: CHUNK_SIZE,
      chunkFiles: chunkPaths,
      isComplete: true,
      timestamp: new Date().toISOString()
    };
    
    // Upload metadata file
    const metadataFileName = `${fileNameBase}_metadata.json`;
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    
    const { error: metadataError } = await supabase.storage
      .from(bucket)
      .upload(metadataFileName, metadataBlob, {
        contentType: 'application/json',
        cacheControl: '3600',
        upsert: true
      });
      
    if (metadataError) {
      throw metadataError;
    }
    
    console.log(`All ${totalChunks} chunks and metadata file uploaded successfully`);
    onProgressUpdate(95);
    
    // Get public URL for the metadata file (we'll use this as the reference)
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(metadataFileName);
      
    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for metadata file');
    }
    
    onProgressUpdate(100);
    console.log(`Chunked upload complete: ${urlData.publicUrl}`);
    
    // Return the metadata file URL as the main file reference
    return {
      publicUrl: urlData.publicUrl,
      filePath: metadataFileName,
      bucket
    };
  } catch (error) {
    console.error('Error in chunked upload process:', error);
    
    // Attempt to clean up any chunks that were uploaded
    try {
      console.log('Cleaning up uploaded chunks after error...');
      for (const chunkPath of chunkPaths) {
        await supabase.storage.from(bucket).remove([chunkPath]);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up chunks:', cleanupError);
    }
    
    throw error;
  }
}
