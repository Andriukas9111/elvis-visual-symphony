
import { supabase } from '@/lib/supabase';

/**
 * Creates a new chunk file from the original file's blob
 */
export function createChunkFile(
  chunkBlob: Blob,
  chunkIndex: number,
  totalChunks: number,
  fileExtension: string,
  contentType: string
): File {
  const chunkFileName = `chunk-${chunkIndex}.${fileExtension}`;
  return new File([chunkBlob], chunkFileName, {
    type: contentType
  });
}

/**
 * Generates a unique filename for a specific chunk
 */
export function generateChunkFileName(
  fileNameBase: string,
  chunkIndex: number,
  totalChunks: number,
  fileExtension: string
): string {
  return `${fileNameBase}_chunk_${chunkIndex}_of_${totalChunks}.${fileExtension}`;
}

/**
 * Cleans up chunks from storage if an error occurs
 */
export async function cleanupChunks(bucket: string, chunkPaths: string[]): Promise<void> {
  try {
    console.log('Cleaning up uploaded chunks after error...');
    for (const chunkPath of chunkPaths) {
      await supabase.storage.from(bucket).remove([chunkPath]);
    }
  } catch (cleanupError) {
    console.error('Error cleaning up chunks:', cleanupError);
    // Don't throw here, as we're likely already handling another error
  }
}
