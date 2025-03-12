
import { supabase } from '@/lib/supabase';
import { uploadVideo, generateThumbnail } from './videoUploader';

/**
 * Uploads a video and creates an associated media entry
 * 
 * @param file The video file to upload
 * @param mediaInfo Additional information about the media
 * @param onProgress Callback for upload progress (0-100)
 * @returns The created media entry
 */
export async function uploadVideoAndCreateMedia(
  file: File,
  mediaInfo: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    is_published?: boolean;
    is_featured?: boolean;
    orientation?: 'horizontal' | 'vertical';
  },
  onProgress?: (progress: number) => void
) {
  try {
    // Step 1: Upload the video
    const { id: videoId, url: videoUrl } = await uploadVideo(file, onProgress);
    
    // Step 2: Generate a thumbnail
    const thumbnailUrl = await generateThumbnail(file, videoId);
    
    // Step 3: Create a media entry linked to the video
    const { data, error } = await supabase
      .from('media')
      .insert({
        id: videoId, // Use the same ID for convenience
        title: mediaInfo.title || file.name,
        description: mediaInfo.description || '',
        type: 'video',
        file_url: videoUrl,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || '',
        video_id: videoId, // Link to the video record
        category: mediaInfo.category || 'uncategorized',
        tags: mediaInfo.tags || [],
        is_published: mediaInfo.is_published ?? false,
        is_featured: mediaInfo.is_featured ?? false,
        orientation: mediaInfo.orientation || 'horizontal',
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    console.log('Media entry created successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error creating media from video:', error);
    throw new Error(`Failed to create media entry: ${error.message}`);
  }
}

/**
 * Get all videos with their media information
 */
export async function getVideosWithMedia() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        media:media(*)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting videos with media:', error);
    return [];
  }
}
