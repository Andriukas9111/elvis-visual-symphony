
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { uploadLargeFile } from './chunkUploader';
import { determineContentType } from '@/utils/fileUtils';

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

  // Determine final content type - use better content type detection
  let finalContentType = contentType;
  if ((contentType === 'application/octet-stream' || !contentType) && extension) {
    finalContentType = determineContentType(file);
    console.log(`Refined content type from ${contentType} to ${finalContentType} based on better detection`);
  }

  console.log(`Uploading file to ${bucket} bucket: ${filePath} with content type: ${finalContentType}`);
  
  try {
    // Log file size for debugging purposes
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`Uploading file of size: ${fileSizeMB}MB to bucket: ${bucket}`);
    
    // For very large files, use chunked upload approach
    if (file.size > CHUNK_SIZE) {
      console.log(`Large file detected (${fileSizeMB}MB), using chunked upload strategy with content type: ${finalContentType}`);
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
    
    // Check for MIME type errors
    if (error.statusCode === 400 && 
        error.message && 
        error.message.includes('mime type')) {
      throw new Error(`MIME type '${finalContentType}' is not supported by the storage bucket. Please use a supported file format.`);
    }
    
    throw error;
  }
};
