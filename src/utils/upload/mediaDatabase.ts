import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { getStorageConfig } from '@/lib/supabase';
import { uploadLargeFile } from './chunkedUploader';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFile = async (
  file: File, 
  filePath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`Uploading file (${fileSizeMB}MB) to media/${filePath}`);
    
    // Get the storage configuration to determine file size limits
    const storageConfig = await getStorageConfig();
    
    // If the file is larger than 8MB (typical Supabase request limit),
    // use the chunked uploader instead
    const SUPABASE_REQUEST_LIMIT = 8 * 1024 * 1024; // 8MB
    
    if (file.size > SUPABASE_REQUEST_LIMIT) {
      console.log(`File is larger than 8MB, using chunked upload method`);
      return await uploadLargeFile('media', file, onProgress);
    }
    
    // For smaller files, use the regular upload method
    // Initialize with 0% progress if callback provided
    if (onProgress) {
      onProgress(0);
    }
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);
    
    // Report 100% progress when done
    if (onProgress) {
      onProgress(100);
    }
    
    console.log('File uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Exception uploading file:', error);
    throw error;
  }
};

/**
 * Creates a new media entry in the database
 */
export const createMediaEntry = async (mediaData: any): Promise<any> => {
  try {
    console.log('Creating media entry:', mediaData);
    
    // Extract data
    const { id, title, type, file, is_published, is_featured, tags, category, orientation } = mediaData;
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const filePath = `uploads/${id}.${fileExt}`;
    
    let fileUrl;
    try {
      // Upload the file to Supabase Storage
      fileUrl = await uploadFile(file, filePath, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      
      if (!fileUrl) {
        throw new Error('File upload failed to return a URL');
      }
      
      // Create the media entry in the database
      const { data, error } = await supabase
        .from('media')
        .insert([
          {
            id,
            title,
            type,
            file_url: fileUrl,
            file_type: file.type,
            file_size: file.size,
            is_published,
            is_featured,
            tags,
            category,
            orientation
          }
        ])
        .select();
      
      if (error) throw error;
      
      console.log('Media entry created:', data[0]);
      return data[0];
    } catch (uploadError: any) {
      console.error('Failed to upload file:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Exception creating media entry:', error);
    throw new Error(`Failed to create media entry: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Fetches chunked video information from the database
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
 * Gets public URLs for chunk files
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
