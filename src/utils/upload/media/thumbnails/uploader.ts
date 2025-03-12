
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Retry a Supabase operation with exponential backoff
 */
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: any;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on timeout errors
      if (error.code === 'DatabaseTimeout' || error.statusCode === '544') {
        retries++;
        const delay = initialDelay * Math.pow(2, retries - 1);
        console.log(`Database operation timed out, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // For non-timeout errors, don't retry
        throw error;
      }
    }
  }
  
  // If we've exhausted retries, throw the last error
  console.error(`Failed after ${maxRetries} retries:`, lastError);
  throw lastError;
};

/**
 * Uploads thumbnails to storage and returns their URLs
 * @param thumbnails Array of thumbnail blobs and timestamps
 * @param videoFileName Original video filename for reference
 * @returns Promise with array of thumbnail URLs and their timestamps
 */
export const uploadThumbnails = async (
  thumbnails: Array<{ blob: Blob; timestamp: number; isVertical: boolean }>,
  videoFileName: string
): Promise<Array<{ url: string; timestamp: number; isVertical: boolean }>> => {
  const uploadPromises = thumbnails.map(async ({ blob, timestamp, isVertical }, index) => {
    // Create a file from the blob
    const fileExt = 'jpg';
    const fileName = `${videoFileName.split('.')[0]}_thumb_${index + 1}_${uuidv4().substring(0, 8)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;
    const thumbnailFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    try {
      // Use retry logic for the upload
      const uploadWithRetry = async () => {
        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, thumbnailFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/jpeg'
          });
        
        if (error) throw error;
        return data;
      };
      
      // Retry the upload operation if it fails
      const data = await retryOperation(uploadWithRetry);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);
      
      return { url: urlData.publicUrl, timestamp, isVertical };
    } catch (error) {
      console.error(`Error uploading thumbnail ${index + 1}:`, error);
      throw error;
    }
  });
  
  return Promise.all(uploadPromises);
};
