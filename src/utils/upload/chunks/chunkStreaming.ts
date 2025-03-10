
import { supabase } from '@/lib/supabase';

/**
 * Creates a HLS-like manifest for chunked video playback
 * This simulates an HLS manifest by returning chunk information
 */
export async function createStreamingManifest(
  videoId: string,
  expirySeconds: number = 86400 // 24 hours by default
): Promise<{ manifestUrl: string; chunks: string[] }> {
  try {
    // Get the chunked video data
    const { data: videoData, error } = await supabase
      .from('chunked_uploads')
      .select('*')
      .eq('id', videoId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!videoData) {
      throw new Error('Video not found');
    }
    
    // Generate signed URLs for all chunks with a long expiry
    const signedUrls = await Promise.all(
      videoData.chunk_files.map(async (chunkPath: string) => {
        const { data } = await supabase.storage
          .from(videoData.storage_bucket)
          .createSignedUrl(chunkPath, expirySeconds);
          
        return data?.signedUrl;
      })
    );
    
    const validUrls = signedUrls.filter(Boolean) as string[];
    
    // For a real HLS implementation, we would create an m3u8 file here
    // But for our purposes, we'll just track the chunks for sequential playback
    
    // Store the manifest reference in the database
    const manifestId = `manifest-${videoId}-${Date.now()}`;
    
    // Return the manifest URL (in a real implementation, this would be a file URL)
    return {
      manifestUrl: `/api/stream/${videoId}`,
      chunks: validUrls
    };
  } catch (error) {
    console.error('Error creating streaming manifest:', error);
    throw error;
  }
}
