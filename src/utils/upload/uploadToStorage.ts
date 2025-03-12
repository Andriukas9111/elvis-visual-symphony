
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase Storage with improved handling for large files
 */
export const uploadFileToStorage = async (
  file: File,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<{ publicUrl: string; filePath: string; bucket: string }> => {
  try {
    const bucket = 'media';
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Define folder based on file type
    const folder = file.type.startsWith('video/') ? 'videos' : 'images';
    const filePath = `${folder}/${fileName}`;
    
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`⬆️ Starting upload for ${fileSizeMB}MB file to ${bucket}/${filePath}`);
    console.log(`Content type: ${contentType}`);
    
    // Set up upload options with increased timeout for large files
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType,
      duplex: 'half'
    };
    
    // Use the standard upload method with optimized options
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, options);
    
    if (uploadError) {
      console.error('❌ Error uploading file:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    console.log('✅ File uploaded successfully:', urlData.publicUrl);
    
    return {
      publicUrl: urlData.publicUrl,
      filePath: filePath,
      bucket: bucket
    };
  } catch (error) {
    console.error('❌ Failed to upload file to storage:', error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase Storage
 */
export const deleteFileFromStorage = async (
  bucket: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    console.log(`File ${bucket}/${filePath} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};
