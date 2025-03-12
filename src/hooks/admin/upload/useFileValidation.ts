
import { determineContentType, validateFileType } from '@/utils/fileUtils';

// Maximum file size (1GB in bytes for videos, 30MB for images)
export const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 1000MB (1GB)
export const MAX_IMAGE_SIZE = 30 * 1024 * 1024;  // 30MB for images

// Maximum size that Supabase Storage can handle by default
// This may need adjustment based on your Supabase configuration
export const SUPABASE_STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB is typical default

export const useFileValidation = () => {
  /**
   * Validates a file before upload
   * @returns { contentType, mediaType }
   * @throws Error if validation fails
   */
  const validateUploadFile = async (file: File) => {
    // Check file size
    const maxFileSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const fileSizeMB = file.size / (1024 * 1024);
    const fileSizeReadable = fileSizeMB.toFixed(2);
    const maxSizeReadable = (maxFileSize / (1024 * 1024)).toFixed(0);
    
    if (file.size > maxFileSize) {
      console.error(`File too large: ${fileSizeReadable}MB (max: ${maxSizeReadable}MB)`);
      throw new Error(`File size ${fileSizeReadable}MB exceeds the maximum allowed size (${maxSizeReadable}MB)`);
    }
    
    // Warn about potential Supabase storage limitations
    if (file.size > SUPABASE_STORAGE_LIMIT) {
      console.warn(`⚠️ File size (${fileSizeReadable}MB) exceeds typical Supabase storage limit of 50MB. Upload may fail unless storage limit has been increased.`);
    }
    
    // Determine and validate content type
    const contentType = determineContentType(file);
    console.log(`File MIME type: ${file.type}, Determined content type: ${contentType}`);
    
    const validation = validateFileType(file);
    
    if (!validation.valid || !validation.type) {
      console.error(`File validation failed: ${validation.error}`);
      throw new Error(validation.error || 'Unsupported file type');
    }
    
    const mediaType = validation.type;
    console.log(`Validated as: ${mediaType}`);

    return { contentType, mediaType };
  };

  return {
    validateUploadFile,
    MAX_VIDEO_SIZE,
    MAX_IMAGE_SIZE,
    SUPABASE_STORAGE_LIMIT
  };
};
