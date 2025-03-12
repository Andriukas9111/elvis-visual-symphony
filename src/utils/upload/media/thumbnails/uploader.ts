
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        });
      
      if (error) throw error;
      
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
