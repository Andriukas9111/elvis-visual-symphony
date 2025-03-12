
import { supabase } from '@/lib/supabase';

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
 * Updates the media entry with the selected thumbnail URL and orientation
 * @param mediaId ID of the media entry to update
 * @param thumbnailUrl URL of the selected thumbnail
 * @param isVertical Whether the video is vertical (portrait) orientation
 * @returns Promise resolving to true if successful
 */
export const updateMediaThumbnail = async (
  mediaId: string,
  thumbnailUrl: string,
  isVertical: boolean = false
): Promise<boolean> => {
  try {
    const updateWithRetry = async () => {
      const { error } = await supabase
        .from('media')
        .update({ 
          thumbnail_url: thumbnailUrl,
          orientation: isVertical ? 'vertical' : 'horizontal',
          updated_at: new Date().toISOString()
        })
        .eq('id', mediaId);
      
      if (error) throw error;
      return true;
    };
    
    await retryOperation(updateWithRetry);
    
    // Log the update for tracking purposes
    console.log(`Updated thumbnail for media ${mediaId}. Orientation: ${isVertical ? 'vertical' : 'horizontal'}`);
    return true;
  } catch (error) {
    console.error('Error updating media thumbnail:', error);
    return false;
  }
};

/**
 * Request server-side thumbnail generation for a video
 * @param videoId The ID of the video to generate thumbnails for
 * @param videoUrl The URL of the video file
 * @returns Promise resolving to the generated thumbnail URL or null if failed
 */
export const requestServerThumbnailGeneration = async (
  videoId: string,
  videoUrl: string
): Promise<{ url: string; isVertical: boolean } | null> => {
  try {
    const generateWithRetry = async () => {
      // Call the edge function to generate thumbnails
      const { data, error } = await supabase.functions.invoke('generate-video-thumbnail', {
        body: { 
          videoId, 
          videoUrl 
        }
      });
      
      if (error) throw error;
      return data;
    };
    
    const data = await retryOperation(generateWithRetry);
    
    if (data?.thumbnailUrl) {
      console.log('Server-generated thumbnail URL:', data.thumbnailUrl);
      // Server can also detect orientation and return it
      return { 
        url: data.thumbnailUrl, 
        isVertical: data.isVertical || false 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error generating server-side thumbnail:', error);
    return null;
  }
};
