
import { supabase } from '../supabase';

// File functions
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  try {
    console.log(`Uploading file to ${bucket}/${path}`);
    
    // Determine if the file is likely a video based on extension, regardless of MIME type
    const fileExtension = path.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
    const isVideoByExtension = fileExtension && videoExtensions.includes(fileExtension);
    
    // Set the correct contentType based on extension if it's application/octet-stream
    let options: any = {
      cacheControl: '3600',
      upsert: true
    };
    
    // If it's application/octet-stream but has a video extension, use the correct MIME type
    if (file.type === 'application/octet-stream' && isVideoByExtension && fileExtension) {
      const mimeTypeMap: Record<string, string> = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'wmv': 'video/x-ms-wmv',
        'mkv': 'video/x-matroska'
      };
      
      if (mimeTypeMap[fileExtension]) {
        options.contentType = mimeTypeMap[fileExtension];
        console.log(`Overriding MIME type to ${options.contentType} based on extension .${fileExtension}`);
      }
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);
    
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
