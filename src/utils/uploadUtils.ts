
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { determineContentType, validateFileType } from './fileUtils';

// Size of each chunk in bytes (5MB)
const CHUNK_SIZE = 5 * 1024 * 1024;

/**
 * Uploads a file to storage using chunked upload for large files
 */
export const uploadFileToStorage = async (
  file: File, 
  contentType: string, 
  onProgressUpdate: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> => {
  // Generate unique filename
  const uniqueId = uuidv4();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const filePath = `${uniqueId}.${extension}`;
  
  // Determine the appropriate bucket based on content type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
  const isVideo = contentType.startsWith('video/') || 
                  (contentType === 'application/octet-stream' && fileExtension && videoExtensions.includes(fileExtension));
  
  // Use the dedicated 'videos' bucket for video files, which has higher size limits
  const bucket = isVideo ? 'videos' : 'media';

  // Determine final content type
  let finalContentType = contentType;
  if ((contentType === 'application/octet-stream' || !contentType) && extension) {
    const mimeTypeMap: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'wmv': 'video/x-ms-wmv',
      'mkv': 'video/x-matroska'
    };
    
    if (mimeTypeMap[extension]) {
      finalContentType = mimeTypeMap[extension];
      console.log(`Overriding MIME type from ${contentType} to ${finalContentType} based on extension .${extension}`);
    }
  }

  console.log(`Uploading file to ${bucket} bucket: ${filePath} with content type: ${finalContentType}`);
  
  try {
    // Log file size for debugging purposes
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`Uploading file of size: ${fileSizeMB}MB to bucket: ${bucket}`);
    
    // For very large files, use chunked upload approach
    if (file.size > CHUNK_SIZE) {
      console.log(`Large file detected (${fileSizeMB}MB), using chunked upload strategy`);
      return await uploadLargeFile(file, filePath, bucket, finalContentType, onProgressUpdate);
    }
    
    // For smaller files, use direct upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: finalContentType,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error.message);
      throw error;
    }
    
    onProgressUpdate(50);
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    onProgressUpdate(100);
    
    return { 
      publicUrl: urlData.publicUrl,
      filePath,
      bucket
    };
  } catch (error: any) {
    // Enhance error logging
    console.error('Storage upload error:', error);
    
    // Check for size-related errors and provide clearer messages
    if (error.statusCode === 413 || 
        (error.error && error.error === 'Payload too large') ||
        (error.message && error.message.includes('maximum allowed size'))) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File size (${fileSizeMB}MB) exceeds Supabase storage limits. The chunked upload system should have prevented this error - please report this issue.`);
    }
    
    throw error;
  }
};

/**
 * Uploads a large file in chunks to avoid storage size limits
 * This implementation uses manual chunking and sequential uploads
 */
async function uploadLargeFile(
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

export const createMediaEntry = async (mediaData: {
  title: string;
  url: string;
  type: 'image' | 'video';
  thumbnail_url: string | null;
  video_url?: string;
  orientation: string;
  file_size: number;
  file_format: string;
  original_filename: string;
  duration?: number;
}): Promise<any> => {
  try {
    console.log('Creating media entry in database:', mediaData);
    
    // Generate a slug from the title
    const slug = mediaData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Prepare the data for insertion
    const newMedia = {
      title: mediaData.title,
      url: mediaData.url,
      type: mediaData.type,
      thumbnail_url: mediaData.thumbnail_url,
      video_url: mediaData.video_url,
      slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
      orientation: mediaData.orientation,
      is_published: true,
      is_featured: false,
      file_size: mediaData.file_size,
      file_format: mediaData.file_format,
      original_filename: mediaData.original_filename,
      tags: mediaData.type === 'video' ? ['video'] : ['image'],
      duration: mediaData.duration,
      sort_order: 0, // Default sort order
      category: mediaData.type === 'video' ? 'videos' : 'images', // Default category based on type
    };
    
    // Insert the media entry into the database
    const { data, error } = await supabase
      .from('media')
      .insert(newMedia)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media entry:', error);
      throw error;
    }
    
    console.log('Media entry created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create media entry:', error);
    throw error;
  }
};
