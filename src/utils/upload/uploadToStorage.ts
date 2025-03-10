
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase Storage
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
    
    console.log(`Uploading file to ${bucket}/${filePath} with content type ${contentType}`);
    
    // Set up upload options
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    };
    
    // Create an upload function that also tracks progress
    let uploadData, uploadError;
    
    if (onProgress) {
      // For browsers that support upload progress, create a custom solution
      // We'll use the fetch API to get around the protected properties issue
      const formData = new FormData();
      formData.append('file', file);
      
      // Construct the Supabase storage URL using the project URL
      const supabaseUrl = supabase.supabaseUrl;
      const storageUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;
      
      // Get auth token from supabase (this is public and safe to use)
      const authToken = supabase.auth.getSession().then(({ data }) => {
        return data.session?.access_token;
      });
      
      try {
        // Create a custom XMLHttpRequest to track progress
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', storageUrl);
          
          // Set necessary headers
          xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
          xhr.setRequestHeader('Content-Type', contentType);
          xhr.setRequestHeader('Cache-Control', 'max-age=3600');
          xhr.setRequestHeader('x-upsert', 'true');
          
          // Track upload progress
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = event.loaded / event.total;
              onProgress(percentComplete);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ path: filePath });
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.send(file);
        });
        
        uploadData = { path: filePath };
      } catch (error) {
        uploadError = error;
        console.error('Custom upload failed, falling back to standard upload', error);
        
        // If custom upload fails, fall back to standard upload without progress
        const { data, error: fallbackError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, options);
          
        uploadData = data;
        uploadError = fallbackError;
      }
    } else {
      // If no progress tracking is needed, use the standard upload method
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, options);
        
      uploadData = data;
      uploadError = error;
    }
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    console.log('File uploaded successfully:', urlData.publicUrl);
    
    return {
      publicUrl: urlData.publicUrl,
      filePath: filePath,
      bucket: bucket
    };
  } catch (error) {
    console.error('Failed to upload file to storage:', error);
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
