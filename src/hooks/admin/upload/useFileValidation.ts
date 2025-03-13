
import { determineContentType, validateFileType } from '@/utils/fileUtils';

// Maximum file size (100MB in bytes for videos, 10MB for images)
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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
    MAX_IMAGE_SIZE
  };
};
