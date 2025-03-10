
import { supabase } from '@/lib/supabase';

export const useMediaDatabase = () => {
  /**
   * Creates a new media entry in the database
   */
  const createDatabaseEntry = async (
    publicUrl: string, 
    file: File, 
    mediaType: 'image' | 'video', 
    contentType: string,
    orientation: string,
    bucket: string,
    filePath: string,
    mediaDuration?: number
  ) => {
    try {
      // Generate a slug from the title
      const title = file.name.split('.')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Prepare the data for insertion
      const newMedia = {
        title: title,
        url: publicUrl,
        type: mediaType,
        thumbnail_url: null,
        video_url: mediaType === 'video' ? publicUrl : undefined,
        slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
        orientation: orientation,
        is_published: true,
        is_featured: false,
        file_size: file.size,
        file_format: contentType,
        original_filename: file.name,
        tags: mediaType === 'video' ? ['video'] : ['image'],
        duration: mediaDuration,
        sort_order: 0, // Default sort order
        category: mediaType === 'video' ? 'videos' : 'images', // Default category based on type
        storage_bucket: bucket,
        storage_path: filePath,
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

  return {
    createDatabaseEntry
  };
};
