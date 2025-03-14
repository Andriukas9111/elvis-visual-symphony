
import { supabase } from '@/lib/supabase';

/**
 * Creates a new media entry in the database
 */
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
      sort_order: 0, // Default sort order
      category: mediaData.type === 'video' ? 'videos' : 'images', // Default category based on type
      // Add metadata for videos to include duration
      metadata: {
        duration: mediaData.duration,
        file_size: mediaData.file_size,
        file_type: mediaData.file_format,
        dimensions: null,
        ...(mediaData.is_chunked ? {
          is_chunked: true,
          chunked_upload_id: mediaData.chunked_upload_id,
          storage_bucket: mediaData.storage_bucket,
          storage_path: mediaData.storage_path
        } : {})
      }
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
