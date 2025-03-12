import { supabase } from '../supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { ExtendedMedia } from '@/hooks/useMedia';

// Media functions
export const getMedia = async (options?: { 
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  tags?: string[];
  orientation?: string;
}): Promise<ExtendedMedia[]> => {
  try {
    console.log('Fetching media from Supabase with options:', options);
    
    let query = supabase
      .from('media')
      .select(`
        *,
        video:video_id(*)
      `);
    
    // Apply filters if they exist
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options?.orientation) {
      query = query.eq('orientation', options.orientation);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }
    
    if (options?.tags && options.tags.length > 0) {
      // Filter by array overlap for tags
      query = query.contains('tags', options.tags);
    }
    
    // Apply default ordering
    query = query
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media:', error);
      throw error;
    }

    // Process the data to integrate video information
    const processedData = data?.map(item => {
      if (item.video_id && item.video) {
        // If it's a video with video data
        const videoUrlFromStorage = supabase.storage
          .from('videos')
          .getPublicUrl(item.video.file_path).data.publicUrl;
        
        const thumbnailUrlFromStorage = item.video.thumbnail_path 
          ? supabase.storage.from('thumbnails').getPublicUrl(item.video.thumbnail_path).data.publicUrl
          : item.thumbnail_url;
        
        return {
          ...item,
          video_url: videoUrlFromStorage,
          thumbnail_url: thumbnailUrlFromStorage || item.thumbnail_url
        };
      }
      return item;
    }) || [];
    
    console.log(`Successfully fetched ${processedData.length} media items`);
    return processedData as ExtendedMedia[];
  } catch (error) {
    console.error('Failed to fetch media:', error);
    throw error;
  }
};

export const getMediaBySlug = async (slug: string): Promise<Tables<'media'> | null> => {
  try {
    console.log(`Fetching media with slug: ${slug}`);
    const { data, error } = await supabase
      .from('media')
      .select(`
        *,
        video:video_id(*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`No media found with slug: ${slug}`);
        return null;
      }
      console.error(`Error fetching media with slug ${slug}:`, error);
      throw error;
    }
    
    // Process video URLs if this is a video
    if (data.video_id && data.video) {
      const videoUrlFromStorage = supabase.storage
        .from('videos')
        .getPublicUrl(data.video.file_path).data.publicUrl;
      
      const thumbnailUrlFromStorage = data.video.thumbnail_path 
        ? supabase.storage.from('thumbnails').getPublicUrl(data.video.thumbnail_path).data.publicUrl
        : data.thumbnail_url;
      
      return {
        ...data,
        video_url: videoUrlFromStorage,
        thumbnail_url: thumbnailUrlFromStorage || data.thumbnail_url
      };
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch media by slug:', error);
    throw error;
  }
};

export const createMedia = async (media: Insertable<'media'>): Promise<Tables<'media'>> => {
  try {
    console.log('Creating new media item:', media);
    const { data, error } = await supabase
      .from('media')
      .insert(media)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media:', error);
      throw error;
    }
    
    console.log('Media created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create media:', error);
    throw error;
  }
};

export const updateMedia = async (id: string, updates: Updatable<'media'>): Promise<Tables<'media'>> => {
  try {
    console.log(`Updating media with id ${id}:`, updates);
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating media ${id}:`, error);
      throw error;
    }
    
    console.log('Media updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update media:', error);
    throw error;
  }
};

export const deleteMedia = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting media with id: ${id}`);
    
    // First check if it's a video
    const { data: mediaData } = await supabase
      .from('media')
      .select('video_id')
      .eq('id', id)
      .single();
    
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting media ${id}:`, error);
      throw error;
    }
    
    // If it had a video_id, also delete the video record and files
    if (mediaData?.video_id) {
      try {
        // Get video data to find file paths
        const { data: videoData } = await supabase
          .from('videos')
          .select('*')
          .eq('id', mediaData.video_id)
          .single();
        
        // Delete files from storage
        if (videoData?.file_path) {
          await supabase.storage.from('videos').remove([videoData.file_path]);
        }
        
        if (videoData?.thumbnail_path) {
          await supabase.storage.from('thumbnails').remove([videoData.thumbnail_path]);
        }
        
        // Delete video record
        await supabase
          .from('videos')
          .delete()
          .eq('id', mediaData.video_id);
      } catch (videoError) {
        console.error('Error cleaning up video data:', videoError);
        // Continue anyway as the media record is already deleted
      }
    }
    
    console.log(`Media ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Failed to delete media:', error);
    throw error;
  }
};

export const updateMediaSortOrder = async (updates: { id: string; sort_order: number }[]): Promise<boolean> => {
  try {
    console.log('Updating media sort order:', updates);
    
    // For improved reliability, we use separate individual updates instead of RPC
    const updatePromises = updates.map(({ id, sort_order }) => 
      supabase
        .from('media')
        .update({ 
          sort_order,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    );
    
    // Execute all updates in parallel
    const results = await Promise.all(updatePromises);
    
    // Check for any errors
    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      console.error('Errors updating media sort order:', errors);
      throw new Error(`${errors.length} errors occurred while updating sort order`);
    }
    
    console.log('Media sort order updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update media sort order:', error);
    throw error;
  }
};
