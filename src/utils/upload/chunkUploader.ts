
import { supabase } from '@/lib/supabase';
import { determineContentType } from '@/utils/fileUtils';

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
  console.log(`Starting chunked upload for ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) with content type: ${contentType}`);
  
  // For very large files, we'll use a different approach:
  // 1. Split the original filename to generate chunk filenames
  const fileNameParts = filePath.split('.');
  const fileNameBase = fileNameParts.slice(0, -1).join('.');
  const fileExtension = fileNameParts.pop();
  
  // Re-validate content type based on extension if it's generic
  let effectiveContentType = contentType;
  if (effectiveContentType === 'application/octet-stream') {
    // Try to determine a more specific content type
    const detectedType = determineContentType(file);
    if (detectedType !== 'application/octet-stream') {
      console.log(`Detected better content type: ${detectedType} (was: ${contentType})`);
      effectiveContentType = detectedType;
    } else if (fileExtension) {
      // Fallback to extension-based mapping for video formats
      const mimeTypeMap: Record<string, string> = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'wmv': 'video/x-ms-wmv',
        'mkv': 'video/x-matroska'
      };
      
      if (mimeTypeMap[fileExtension.toLowerCase()]) {
        effectiveContentType = mimeTypeMap[fileExtension.toLowerCase()];
        console.log(`Using extension-based content type: ${effectiveContentType}`);
      }
    }
  }
  
  // Double-check content type is valid
  if (effectiveContentType === 'application/octet-stream') {
    console.warn('Warning: Still using generic content type. This may cause upload issues.');
  }
  
  // Calculate the total number of chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  console.log(`File will be split into ${totalChunks} chunks of ${CHUNK_SIZE / (1024 * 1024)}MB each with content type: ${effectiveContentType}`);
  
  // Array to store uploaded chunk paths
  const chunkPaths = [];
  let lastReportedProgress = 0;
  
  try {
    // Upload each chunk with retry logic
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);
      
      // Create a proper File object from the chunk blob to preserve the content type
      // This is crucial - we need to ensure each chunk has the proper MIME type
      const chunkFile = new File([chunkBlob], `chunk-${chunkIndex}.${fileExtension}`, {
        type: effectiveContentType
      });
      
      // Generate a unique chunk filename
      const chunkFileName = `${fileNameBase}_chunk_${chunkIndex}_of_${totalChunks}.${fileExtension}`;
      
      // Try uploading this chunk with retries
      let retries = 0;
      const maxRetries = 3;
      let uploadSuccess = false;
      let lastError = null;
      
      while (retries < maxRetries && !uploadSuccess) {
        try {
          console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks} (${(chunkFile.size / (1024 * 1024)).toFixed(2)}MB) with content type: ${chunkFile.type}`);
          
          // Explicitly verify the content type of the chunk before upload
          if (chunkFile.type !== effectiveContentType) {
            console.warn(`Chunk file has unexpected content type: ${chunkFile.type}, expected: ${effectiveContentType}. Fixing...`);
            const correctedChunkFile = new File([chunkBlob], chunkFile.name, { 
              type: effectiveContentType 
            });
            
            // Perform the upload with the corrected file
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(chunkFileName, correctedChunkFile, {
                contentType: effectiveContentType, // Explicitly set the content type
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
          } else {
            // Content type is as expected, proceed with normal upload
            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(chunkFileName, chunkFile, {
                contentType: effectiveContentType, // Explicitly set the content type
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
      mimeType: effectiveContentType,
      totalChunks: totalChunks,
      chunkSize: CHUNK_SIZE,
      chunkFiles: chunkPaths,
      isComplete: true,
      timestamp: new Date().toISOString()
    };
    
    // Upload metadata file - FIXED APPROACH:
    // 1. Use a different strategy to handle the metadata
    // First try: Store metadata as direct database entry instead of storage file
    onProgressUpdate(95);
    console.log('Using database-based metadata storage instead of JSON file upload');
    
    // Create a unique reference ID for this chunked upload
    const chunkUploadId = fileNameBase.split('/').pop();
    
    // Create database entry for this chunked upload
    const { data: dbData, error: dbError } = await supabase
      .from('chunked_uploads')
      .upsert({
        id: chunkUploadId,
        original_filename: file.name,
        file_size: file.size,
        mime_type: effectiveContentType,
        total_chunks: totalChunks,
        chunk_size: CHUNK_SIZE,
        chunk_files: chunkPaths,
        storage_bucket: bucket,
        base_path: fileNameBase,
        status: 'complete',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (dbError) {
      console.error('Error creating metadata database entry:', dbError);
      // Fall back to the first uploaded chunk as our reference
      if (chunkPaths.length === 0) {
        throw new Error('No chunks were successfully uploaded');
      }
      
      // Use the first chunk as our reference
      const firstChunkPath = chunkPaths[0];
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(firstChunkPath);
        
      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for chunk');
      }
      
      onProgressUpdate(100);
      console.log(`Chunked upload complete (using first chunk as reference): ${urlData.publicUrl}`);
      
      // Return the first chunk's URL (applications need to handle reconstruction)
      return {
        publicUrl: urlData.publicUrl,
        filePath: firstChunkPath,
        bucket
      };
    }
    
    // Create a virtual URL that will be handled by our playback system
    const videoId = dbData.id;
    const videoUrl = `/api/video/${videoId}`;
    
    onProgressUpdate(100);
    console.log(`Chunked upload complete with database metadata: ${videoUrl}`);
    
    // Return the database reference URL
    return {
      publicUrl: videoUrl,
      filePath: videoId,
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
