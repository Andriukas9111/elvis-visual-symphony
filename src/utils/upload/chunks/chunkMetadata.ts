
import { supabase } from '@/lib/supabase';

/**
 * Stores metadata about a chunked upload in the database
 */
export async function storeChunkedUploadMetadata(
  file: File,
  fileNameBase: string,
  bucket: string,
  chunkPaths: string[],
  totalChunks: number,
  chunkSize: number,
  contentType: string
): Promise<{ videoId: string; videoUrl: string }> {
  // Create a unique reference ID for this chunked upload
  const chunkUploadId = fileNameBase.split('/').pop();
  
  // Create database entry for this chunked upload
  const { data, error } = await supabase
    .from('chunked_uploads')
    .upsert({
      id: chunkUploadId,
      original_filename: file.name,
      file_size: file.size,
      mime_type: contentType,
      total_chunks: totalChunks,
      chunk_size: chunkSize,
      chunk_files: chunkPaths,
      storage_bucket: bucket,
      base_path: fileNameBase,
      status: 'complete',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating metadata database entry:', error);
    throw error;
  }
  
  // Create a virtual URL that will be handled by our playback system
  const videoId = data.id;
  const videoUrl = `/api/video/${videoId}`;
  
  return { videoId, videoUrl };
}
