
import { determineContentType, validateFileType } from '@/utils/fileUtils';
import { getStorageConfig } from '@/lib/supabase';

// Maximum file size (1GB in bytes for videos, 30MB for images)
export const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 1000MB (1GB) client-side limit
export const MAX_IMAGE_SIZE = 30 * 1024 * 1024;  // 30MB for images

// Default Supabase storage limit if we can't detect it
export const DEFAULT_SUPABASE_STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB is typical default

export const useFileValidation = () => {
  /**
   * Validates a file before upload
   * @returns { contentType, mediaType, sizeWarning }
   * @throws Error if validation fails
   */
  const validateUploadFile = async (file: File) => {
    // Check file size against client-side limits
    const maxFileSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const fileSizeMB = file.size / (1024 * 1024);
    const fileSizeReadable = fileSizeMB.toFixed(2);
    const maxSizeReadable = (maxFileSize / (1024 * 1024)).toFixed(0);
    
    if (file.size > maxFileSize) {
      console.error(`File too large: ${fileSizeReadable}MB (max: ${maxSizeReadable}MB)`);
      throw new Error(`File size ${fileSizeReadable}MB exceeds the maximum allowed size (${maxSizeReadable}MB)`);
    }
    
    // Get Supabase storage limit (if available)
    let sizeWarning = null;
    let supabaseLimit = DEFAULT_SUPABASE_STORAGE_LIMIT;
    
    try {
      const config = await getStorageConfig();
      if (config && config.fileSizeLimit) {
        supabaseLimit = config.fileSizeLimit;
        console.log(`Detected Supabase storage limit: ${config.fileSizeLimitFormatted}`);
      }
    } catch (error) {
      console.warn('Could not detect Supabase storage limit:', error);
    }
    
    // Warn about potential Supabase storage limitations
    if (file.size > supabaseLimit) {
      const supabaseLimitMB = (supabaseLimit / (1024 * 1024)).toFixed(0);
      const warningMsg = `File size (${fileSizeReadable}MB) exceeds the Supabase storage limit (${supabaseLimitMB}MB). Upload will likely fail unless you've increased the limit in supabase/config.toml.`;
      
      console.warn(`⚠️ ${warningMsg}`);
      sizeWarning = warningMsg;
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

    return { contentType, mediaType, sizeWarning };
  };

  // Detect if the Supabase storage limit has been increased beyond the default
  const checkSupabaseStorageLimit = async () => {
    try {
      const config = await getStorageConfig();
      if (config && config.fileSizeLimit) {
        return config.fileSizeLimit;
      }
    } catch (error) {
      console.warn('Could not check Supabase storage limit:', error);
    }
    return DEFAULT_SUPABASE_STORAGE_LIMIT;
  };

  return {
    validateUploadFile,
    checkSupabaseStorageLimit,
    MAX_VIDEO_SIZE,
    MAX_IMAGE_SIZE,
    DEFAULT_SUPABASE_STORAGE_LIMIT
  };
};
