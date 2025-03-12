
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorLogger';

// Function to check if a bucket exists and retry if needed
const ensureBucketExists = async (bucketName: string, maxRetries = 3): Promise<boolean> => {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`Checking if bucket '${bucketName}' exists (attempt ${retryCount + 1}/${maxRetries})...`);
      
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error) {
        console.warn(`Bucket check failed: ${error.message}`);
        // If not found, small delay before retry
        if (error.message.includes('not found')) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Waiting before retry ${retryCount}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
        }
        return false;
      }
      
      if (data) {
        console.log(`Bucket '${bucketName}' exists:`, data);
        return true;
      }
    } catch (err) {
      console.error(`Error checking bucket: ${err}`);
    }
    
    retryCount++;
    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
  }
  
  return false;
};

export const uploadFileToStorage = async (
  file: File,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> => {
  try {
    const bucket = 'media';
    const fileExt = file.name.split('.').pop();
    const fileName = `${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExt}`;
    
    // Define folder based on file type
    const folder = file.type.startsWith('video/') ? 'videos' : 'images';
    const filePath = `${folder}/${fileName}`;
    
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`⬆️ Starting upload for ${fileSizeMB}MB file to ${bucket}/${filePath}`);
    console.log(`Content type: ${contentType}`);
    
    // Check if the bucket exists with retry logic
    const bucketExists = await ensureBucketExists(bucket);
    
    if (!bucketExists) {
      throw new Error(`Storage bucket '${bucket}' not found or inaccessible. Please ensure it's created in your Supabase project.`);
    }
      
    // Set up upload options with increased timeout for large files
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType,
      duplex: 'half'
    };
    
    // Use the standard upload method with optimized options
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, options);
    
    if (uploadError) {
      logError(uploadError, {
        context: 'uploadFileToStorage',
        level: 'error',
        additionalData: {
          bucket,
          filePath,
          fileSize: fileSizeMB,
          contentType,
          errorMessage: uploadError.message,
          errorName: uploadError.name
        }
      });

      // Enhanced error handling with specific messages based on error message patterns
      const errorMessage = uploadError.message || '';
      
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        throw new Error(`File already exists. Please try again with a different name.`);
      }
      
      if (errorMessage.includes('too large') || errorMessage.includes('exceeded')) {
        throw new Error(`File size (${fileSizeMB}MB) exceeds the server limit.`);
      }
      
      if (errorMessage.includes('permission') || errorMessage.includes('not allowed') || errorMessage.includes('403')) {
        throw new Error(`Permission denied. Please check storage bucket permissions.`);
      }
      
      if (errorMessage.includes('server error') || errorMessage.includes('500')) {
        throw new Error(
          `Server error during upload. This might be due to:\n` +
          `1. File too large for server configuration\n` +
          `2. Server storage quota exceeded\n` +
          `3. Temporary server issue\n\n` +
          `Please try:\n` +
          `- Using a smaller file\n` +
          `- Checking server storage settings\n` +
          `- Trying again in a few minutes`
        );
      }
      
      throw new Error(`Upload failed: ${errorMessage || 'Unknown error'}`);
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    console.log('✅ File uploaded successfully:', urlData.publicUrl);
    
    return {
      publicUrl: urlData.publicUrl,
      filePath: filePath,
      bucket: bucket
    };
  } catch (error: any) {
    // Log the full error details
    logError(error, {
      context: 'uploadFileToStorage',
      level: 'error',
      additionalData: {
        originalError: error,
        errorStack: error.stack
      }
    });
    
    // Rethrow with a user-friendly message
    throw error;
  }
};

export const deleteFileFromStorage = async (
  bucket: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      logError(error, {
        context: 'deleteFileFromStorage',
        level: 'error',
        additionalData: { bucket, filePath }
      });
      throw error;
    }
    
    console.log(`File ${bucket}/${filePath} deleted successfully`);
    return true;
  } catch (error) {
    logError(error, {
      context: 'deleteFileFromStorage',
      level: 'error',
      additionalData: { bucket, filePath }
    });
    throw error;
  }
};
