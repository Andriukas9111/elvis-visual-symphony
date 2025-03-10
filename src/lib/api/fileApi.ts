
import { supabase } from '../supabase';

// File functions
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  try {
    console.log(`Uploading file to ${bucket}/${path}`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log('File uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    console.log(`Deleting file from ${bucket}/${path}`);
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};
