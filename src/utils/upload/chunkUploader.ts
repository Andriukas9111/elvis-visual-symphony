import { supabase } from '@/lib/supabase';
import { determineContentType } from '@/utils/fileUtils';
import { 
  createChunkFile, 
  generateChunkFileName, 
  uploadChunk,
  storeChunkedUploadMetadata,
  cleanupChunks
} from './chunks';

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
      
      // Create a proper File object with the correct content type
      const chunkFile = createChunkFile(chunkBlob, chunkIndex, totalChunks, fileExtension, effectiveContentType);
      
      // Generate a unique chunk filename
      const chunkFileName = generateChunkFileName(fileNameBase, chunkIndex, totalChunks, fileExtension);
      
      // Upload this chunk with retries
      const uploadedChunkPath = await uploadChunk(
        chunkFile, 
        chunkFileName, 
        bucket, 
        effectiveContentType, 
        chunkIndex, 
        totalChunks
      );
      
      chunkPaths.push(uploadedChunkPath);
      
      // Update progress (ensure we report distinct progress values to avoid UI flicker)
      const currentProgress = Math.round((chunkIndex + 1) / totalChunks * 90); // Save 10% for finalizing
      if (currentProgress > lastReportedProgress) {
        onProgressUpdate(currentProgress);
        lastReportedProgress = currentProgress;
      }
    }
    
    // All chunks uploaded successfully, store metadata in database
    onProgressUpdate(95);
    console.log('Using database-based metadata storage instead of JSON file upload');
    
    try {
      // Store metadata in database
      const { videoId, videoUrl } = await storeChunkedUploadMetadata(
        file,
        fileNameBase,
        bucket,
        chunkPaths,
        totalChunks,
        CHUNK_SIZE,
        effectiveContentType
      );
      
      onProgressUpdate(100);
      console.log(`Chunked upload complete with database metadata: ${videoUrl}`);
      
      // Return the database reference URL
      return {
        publicUrl: videoUrl,
        filePath: videoId,
        bucket
      };
    } catch (metadataError) {
      console.error('Error storing metadata:', metadataError);
      
      // Fall back to the first uploaded chunk as our reference if metadata storage fails
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
  } catch (error) {
    console.error('Error in chunked upload process:', error);
    
    // Attempt to clean up any chunks that were uploaded
    await cleanupChunks(bucket, chunkPaths);
    
    throw error;
  }
}
