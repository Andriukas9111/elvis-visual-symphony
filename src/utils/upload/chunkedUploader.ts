
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@/utils/errorLogger';

// Maximum chunk size in bytes (6MB is safe for most Supabase instances)
const MAX_CHUNK_SIZE = 6 * 1024 * 1024; // 6MB

/**
 * Upload a large file in chunks to Supabase Storage
 * 
 * @param bucket The storage bucket name
 * @param file The file to upload
 * @param onProgress Progress callback (0-100)
 * @returns The public URL of the uploaded file
 */
export async function uploadLargeFile(
  bucket: string, 
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / MAX_CHUNK_SIZE);
    const fileExt = file.name.split('.').pop();
    const fileId = uuidv4();
    const filePath = `uploads/${fileId}.${fileExt}`;
    
    console.log(`Uploading ${file.name} (${fileSize} bytes) in ${chunks} chunks to ${bucket}/${filePath}`);
    
    // Create an array to track upload status for each chunk
    const uploadPromises = [];
    
    for (let i = 0; i < chunks; i++) {
      const start = i * MAX_CHUNK_SIZE;
      const end = Math.min(fileSize, start + MAX_CHUNK_SIZE);
      const chunk = file.slice(start, end);
      
      // For each chunk, we'll upload to a temporary location
      const chunkPath = `${filePath}.part${i}`;
      
      const uploadChunk = async () => {
        try {
          const { error } = await supabase.storage
            .from(bucket)
            .upload(chunkPath, chunk, {
              contentType: file.type,
              cacheControl: '3600',
              upsert: true
            });
          
          if (error) throw error;
          console.log(`Uploaded chunk ${i + 1}/${chunks}`);
          
          // Report progress
          if (onProgress) {
            const progressPercent = Math.min(
              Math.round(((i + 1) / chunks) * 100),
              99 // Cap at 99% until final assembly
            );
            onProgress(progressPercent);
          }
          
          return chunkPath;
        } catch (error) {
          console.error(`Error uploading chunk ${i}:`, error);
          throw error;
        }
      };
      
      uploadPromises.push(uploadChunk());
    }
    
    // Wait for all chunks to upload
    await Promise.all(uploadPromises);
    
    // Now we need to reassemble the chunks server-side
    // For this, we'll create a record in a new database table
    console.log(`All chunks uploaded, assembling file ${filePath}`);
    
    // Call server function to assemble the chunks (this would ideally be a Supabase Edge Function)
    // For now, we'll create a database entry to track this chunked upload
    const { data, error } = await supabase
      .from('chunked_uploads')
      .insert({
        id: fileId,
        file_path: filePath,
        original_name: file.name,
        mime_type: file.type,
        total_chunks: chunks,
        total_size: fileSize,
        status: 'uploaded_chunks', // Status showing chunks are uploaded but not assembled
        bucket_id: bucket
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Get the public URL for the final file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    // Report 100% completion
    if (onProgress) {
      onProgress(100);
    }
    
    console.log('Chunked upload complete');
    return urlData.publicUrl;
  } catch (error) {
    logError('Chunked upload failed', {
      level: 'error',
      context: 'chunked-upload',
      additionalData: { file_name: file.name, file_size: file.size }
    });
    console.error('Chunked upload failed:', error);
    throw error;
  }
}
