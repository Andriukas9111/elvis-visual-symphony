
import { supabase } from '@/lib/supabase';

/**
 * Updates metadata for a chunked video
 */
export const updateChunkedVideoMetadata = async (
  videoId: string, 
  updates: {
    thumbnail_url?: string;
    duration?: number;
    status?: string;
  }
) => {
  try {
    // Update the media entry
    const { data: mediaData } = await supabase
      .from('media')
      .select('id, metadata')
      .eq('metadata->chunked_upload_id', videoId)
      .maybeSingle();
      
    if (mediaData?.id) {
      // Prepare updates
      const updateData: any = {};
      
      if (updates.thumbnail_url) {
        updateData.thumbnail_url = updates.thumbnail_url;
      }
      
      if (updates.duration) {
        updateData.duration = updates.duration;
      }
      
      // Update metadata
      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('media')
          .update(updateData)
          .eq('id', mediaData.id);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating chunked video metadata:', error);
    return false;
  }
};
