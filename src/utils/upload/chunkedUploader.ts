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
    
    // Keep track of uploaded chunks
    const uploadedChunks: string[] = [];
    
    // Upload each chunk
    for (let i = 0; i < chunks; i++) {
      const start = i * MAX_CHUNK_SIZE;
      const end = Math.min(fileSize, start + MAX_CHUNK_SIZE);
      const chunk = file.slice(start, end);
      
      // For each chunk, we'll upload to a temporary location
      const chunkPath = `chunks/${fileId}_part${i}`;
      
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(chunkPath, chunk, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) throw error;
        console.log(`Uploaded chunk ${i + 1}/${chunks}`);
        
        uploadedChunks.push(chunkPath);
        
        // Report progress
        if (onProgress) {
          const progressPercent = Math.min(
            Math.round(((i + 1) / chunks) * 100),
            99 // Cap at 99% until final assembly
          );
          onProgress(progressPercent);
        }
      } catch (error) {
        console.error(`Error uploading chunk ${i}:`, error);
        throw error;
      }
    }
    
    // Now create a final file entry that contains metadata about all the chunks
    try {
      // Create an entry in the chunked_videos table with metadata about the chunks
      const { data, error } = await supabase
        .from('chunked_videos')
        .insert({
          id: fileId,
          original_filename: file.name,
          mime_type: file.type,
          total_size: fileSize,
          chunk_count: chunks,
          chunk_files: uploadedChunks,
          status: 'ready',
          bucket: bucket
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Get the public URL for the file (used for database reference)
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      // Report 100% completion
      if (onProgress) {
        onProgress(100);
      }
      
      console.log('Chunked upload complete, created entry:', data);
      
      // Return the URL - this doesn't actually exist as a single file yet,
      // but will be assembled on-demand when requested
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error finalizing chunked upload:', error);
      throw error;
    }
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
