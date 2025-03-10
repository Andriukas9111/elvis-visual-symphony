
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { determineContentType } from '@/utils/fileUtils';

/**
 * Uploads a file to storage with progress tracking
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
    finalContentType = determineContentType(file);
    console.log(`Refined content type from ${contentType} to ${finalContentType} based on better detection`);
  }

  console.log(`Uploading file to ${bucket} bucket: ${filePath} with content type: ${finalContentType}`);
  console.log(`File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  
  try {
    // For videos, check size limit
    if (isVideo && file.size > 100 * 1024 * 1024) {
      throw new Error(`Video size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 100MB limit. Please compress your video.`);
    }
    
    // Set up progress tracking
    let lastProgress = 0;
    const uploadOptions = {
      contentType: finalContentType,
      cacheControl: '3600',
      upsert: true,
      onUploadProgress: (progress: { percent?: number }) => {
        const percent = progress.percent || 0;
        const roundedPercent = Math.round(percent);
        
        // Only update if progress has changed significantly to reduce UI updates
        if (roundedPercent > lastProgress + 2) {
          onProgressUpdate(roundedPercent);
          lastProgress = roundedPercent;
        }
      }
    };
    
    // Upload file with progress tracking
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, uploadOptions);

    if (error) {
      console.error('Upload error:', error.message);
      throw error;
    }
    
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
    console.error('Storage upload error:', error);
    
    // Check for size-related errors
    if (error.statusCode === 413 || 
        (error.error && error.error === 'Payload too large') ||
        (error.message && error.message.includes('maximum allowed size'))) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File size (${fileSizeMB}MB) exceeds the maximum allowed size. Please compress your video or upload a smaller file.`);
    }
    
    // Check for MIME type errors
    if (error.statusCode === 400 && 
        error.message && 
        error.message.includes('mime type')) {
      throw new Error(`MIME type '${finalContentType}' is not supported. Please use a supported file format.`);
    }
    
    throw error;
  }
};
