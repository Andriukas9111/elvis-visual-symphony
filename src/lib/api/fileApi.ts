
import { supabase } from '../supabase';

export const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  try {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.log(`Uploading file (${fileSizeMB}MB) to ${bucket}/${path}`);
    
    // Determine file type and appropriate MIME type
    const fileExtension = path.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
    const isVideoByExtension = fileExtension && videoExtensions.includes(fileExtension);
    
    let contentType = file.type;
    
    // Handle application/octet-stream for video files
    if ((file.type === 'application/octet-stream' || !file.type) && isVideoByExtension && fileExtension) {
      const mimeTypeMap: Record<string, string> = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'wmv': 'video/x-ms-wmv',
        'mkv': 'video/x-matroska'
      };
      
      if (mimeTypeMap[fileExtension]) {
        contentType = mimeTypeMap[fileExtension];
        console.log(`Using MIME type ${contentType} based on extension .${fileExtension}`);
      }
    }
    
    console.log(`Uploading file with content type: ${contentType}`);
    
    // Upload file with explicit content type and optimized configuration
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        cacheControl: '3600',
        upsert: true,
        duplex: 'half'
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
