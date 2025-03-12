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
      .select('*');
    
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

    // Log the fetched data with important fields for debugging
    console.log(`Successfully fetched ${data?.length || 0} media items`);
    if (data && data.length > 0) {
      console.log('Fetched media items:', data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        file_url: item.file_url,
        video_url: item.video_url,
        thumbnail_url: item.thumbnail_url,
        is_featured: item.is_featured
      })));
    }
    
    return (data || []) as ExtendedMedia[];
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
      .select('*')
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
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting media ${id}:`, error);
      throw error;
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
          // Add a timestamp to ensure the updated_at gets refreshed
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    );
    
    // Log each update for debugging
    updates.forEach(({ id, sort_order }) => {
      console.log(`Setting sort_order=${sort_order} for media item ${id}`);
    });
    
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
