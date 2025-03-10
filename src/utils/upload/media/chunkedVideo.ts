
import { supabase } from '@/lib/supabase';

/**
 * Retrieves chunked video data from the database
 */
export const getChunkedVideo = async (videoId: string) => {
  try {
    const { data, error } = await supabase
      .from('chunked_uploads')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching chunked video:', error);
    throw error;
  }
};

/**
 * Generates signed URLs for video chunks
 */
export const getChunkUrls = async (chunkFiles: string[], bucket: string, expirySeconds = 3600) => {
  try {
    const signedUrls = await Promise.all(
      chunkFiles.map(async (chunkPath) => {
        const { data } = await supabase.storage
          .from(bucket)
          .createSignedUrl(chunkPath, expirySeconds);
          
        return data?.signedUrl;
      })
    );
    
    return signedUrls.filter(Boolean);
  } catch (error) {
    console.error('Error generating signed URLs for chunks:', error);
    throw error;
  }
};
