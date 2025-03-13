
import { supabase } from '@/lib/supabase';
import { getChunkedVideo, getChunkUrls } from './chunkedVideo';

/**
 * Attempts to generate a thumbnail for a chunked video
 */
export const generateVideoThumbnail = async (videoId: string, thumbnailUrl?: string): Promise<string | null> => {
  // If a thumbnail URL is already provided, just return it
  if (thumbnailUrl) {
    return thumbnailUrl;
  }
  
  try {
    // First, get the video data
    const videoData = await getChunkedVideo(videoId);
    if (!videoData || !videoData.chunk_files || videoData.chunk_files.length === 0) {
      throw new Error('Video data not found or has no chunks');
    }
    
    // Get a signed URL for the first chunk to generate a thumbnail
    const firstChunkUrls = await getChunkUrls([videoData.chunk_files[0]], videoData.storage_bucket);
    if (!firstChunkUrls || firstChunkUrls.length === 0) {
      throw new Error('Could not get URL for first chunk');
    }
    
    // For server-side thumbnail generation, we would use a serverless function
    // But for client-side as a fallback, we'll return the URL to use with a video element
    console.log('Using first chunk for thumbnail generation:', firstChunkUrls[0]);
    
    // For now, we'll just return null and let the UI handle showing a default thumbnail
    // In a production environment, this would call a serverless function to generate the thumbnail
    
    // Update the media entry to indicate thumbnail generation was attempted
    const { data: mediaData } = await supabase
      .from('media')
      .select('id')
      .eq('metadata->chunked_upload_id', videoId)
      .maybeSingle();
      
    if (mediaData?.id) {
      // Update the metadata to indicate thumbnail generation was attempted
      await supabase
        .from('media')
        .update({
          metadata: {
            ...videoData.metadata,
            thumbnail_generation_attempted: true,
            thumbnail_generation_time: new Date().toISOString()
          }
        })
        .eq('id', mediaData.id);
    }
    
    return null;
  } catch (error) {
    console.error('Error generating video thumbnail:', error);
    return null;
  }
};
