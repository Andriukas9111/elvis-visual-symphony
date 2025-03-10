import { supabase } from './supabase';

export const getMedia = async () => {
  try {
    console.log('Fetching media from Supabase');
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No media items found in database');
      return [];
    }

    console.log(`Successfully fetched ${data.length} media items`);
    
    // Validate items and provide detailed logging for troubleshooting
    const validatedData = data.map(item => {
      // Log warnings for items with missing critical fields
      if (!item.url) {
        console.warn(`Media item ${item.id} (${item.title}) is missing URL`);
      }
      
      if (item.type === 'video' && !item.video_url) {
        console.warn(`Video item ${item.id} (${item.title}) is missing video_url`);
      }
      
      return item;
    });

    return validatedData;
  } catch (error) {
    console.error('Failed to fetch media:', error);
    throw error;
  }
};
