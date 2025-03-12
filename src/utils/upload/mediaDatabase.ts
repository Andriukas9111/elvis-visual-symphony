import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFile = async (file: File, path: string) => {
  try {
    console.log(`Uploading file ${file.name} to path: ${path}`);
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception uploading file:', error);
    throw error;
  }
};

/**
 * Temporary implementation for getChunkedVideo
 * Will be replaced with actual database calls
 */
export const getChunkedVideo = async (videoId: string) => {
  console.log('Fetching chunked video with ID:', videoId);
  
  try {
    const { data, error } = await supabase
      .from('chunked_videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) {
      console.error('Error fetching chunked video:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching chunked video:', error);
    return null;
  }
};

/**
 * Temporary implementation for getChunkUrls
 * Will be replaced with actual storage access
 */
export const getChunkUrls = async (chunkFiles: string[], bucket: string) => {
  console.log('Getting URLs for chunks:', chunkFiles, 'from bucket:', bucket);
  
  try {
    // If no chunk files provided, return empty array
    if (!chunkFiles || chunkFiles.length === 0) {
      return [];
    }
    
    // Get public URLs for each chunk
    const urls = chunkFiles.map(path => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return data.publicUrl;
    });
    
    return urls;
  } catch (error) {
    console.error('Error getting chunk URLs:', error);
    return [];
  }
};

/**
 * Creates a new media entry in the database
 */
export const createMediaEntry = async (mediaData: any) => {
  try {
    console.log('Creating media entry:', mediaData);
    
    // Generate a unique ID if one isn't provided
    const mediaId = mediaData.id || uuidv4();
    
    // If there's a file to upload, do that first
    if (mediaData.file) {
      const extension = mediaData.file.name.split('.').pop();
      const filePath = `uploads/${mediaId}.${extension}`;
      
      // Upload the file
      const fileUrl = await uploadFile(mediaData.file, filePath);
      
      // Add the URL to the media data
      mediaData.file_url = fileUrl;
    }
    
    // Add metadata and timestamps
    const entry = {
      ...mediaData,
      id: mediaId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Remove the file object before inserting into database
    delete entry.file;
    
    // Insert into media table
    const { data, error } = await supabase
      .from('media')
      .insert([entry])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media entry:', error);
      throw error;
    }
    
    console.log('Media entry created successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception creating media entry:', error);
    throw new Error('Failed to create media entry: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Updates the sort order for a batch of media items
 */
export const updateMediaOrder = async (orderUpdates: { id: string; sort_order: number }[]) => {
  try {
    console.log('Updating media order for', orderUpdates.length, 'items');
    
    // Execute updates in parallel for better performance
    const updatePromises = orderUpdates.map(({ id, sort_order }) => {
      return supabase
        .from('media')
        .update({ 
          sort_order,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    });
    
    const results = await Promise.all(updatePromises);
    
    // Check for errors
    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      console.error('Errors updating media order:', errors);
      throw new Error(`${errors.length} errors occurred during order update`);
    }
    
    console.log('Media order updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating media order:', error);
    throw error;
  }
};
