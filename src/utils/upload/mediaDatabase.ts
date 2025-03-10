
import { supabase } from '@/lib/supabase';

export const createMediaEntry = async (mediaData: {
  title: string;
  url: string;
  type: 'image' | 'video';
  thumbnail_url: string | null;
  video_url?: string;
  orientation: string;
  file_size: number;
  file_format: string;
  original_filename: string;
  duration?: number;
  storage_bucket?: string;
  storage_path?: string;
  is_chunked?: boolean;
  chunked_upload_id?: string;
}): Promise<any> => {
  try {
    console.log('Creating media entry in database:', mediaData);
    
    // Generate a slug from the title
    const slug = mediaData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Prepare the data for insertion
    const newMedia = {
      title: mediaData.title,
      url: mediaData.url,
      type: mediaData.type,
      thumbnail_url: mediaData.thumbnail_url,
      video_url: mediaData.video_url,
      slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
      orientation: mediaData.orientation,
      is_published: true,
      is_featured: false,
      file_size: mediaData.file_size,
      file_format: mediaData.file_format,
      original_filename: mediaData.original_filename,
      tags: mediaData.type === 'video' ? ['video'] : ['image'],
      duration: mediaData.duration,
      sort_order: 0, // Default sort order
      category: mediaData.type === 'video' ? 'videos' : 'images', // Default category based on type
      // Add metadata for chunked videos if applicable
      metadata: mediaData.is_chunked ? {
        is_chunked: true,
        chunked_upload_id: mediaData.chunked_upload_id,
        storage_bucket: mediaData.storage_bucket,
        storage_path: mediaData.storage_path
      } : null
    };
    
    // Insert the media entry into the database
    const { data, error } = await supabase
      .from('media')
      .insert(newMedia)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media entry:', error);
      throw error;
    }
    
    console.log('Media entry created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create media entry:', error);
    throw error;
  }
};

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
