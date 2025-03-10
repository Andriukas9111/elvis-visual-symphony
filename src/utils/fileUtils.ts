
/**
 * Utilities for file handling and MIME type detection
 */

// Map extensions to MIME types
export const mimeTypeMap: Record<string, string> = {
  // Video types
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',
  'wmv': 'video/x-ms-wmv',
  'mkv': 'video/x-matroska',
  // Image types
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp'
};

/**
 * Determines the correct content type based on file extension and MIME type
 */
export const determineContentType = (file: File): string => {
  // Get the file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  // Determine the content type
  let contentType = file.type;
  
  // If content type is missing or generic, use extension to determine it
  if (!contentType || contentType === 'application/octet-stream') {
    if (extension && mimeTypeMap[extension]) {
      contentType = mimeTypeMap[extension];
      console.log(`Detected file with octet-stream MIME type, using extension to set type to: ${contentType}`);
    } else {
      contentType = 'application/octet-stream';
    }
  }
  
  return contentType;
};

/**
 * Validates if a file type is supported for upload
 */
export const validateFileType = (file: File): { valid: boolean; error?: string; type?: 'video' | 'image' } => {
  const originalContentType = file.type;
  const contentType = determineContentType(file);
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  console.log(`Validating file: ${file.name}, original mime: ${originalContentType}, determined type: ${contentType}`);
  
  // Check if it's a video by extension
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
  const isVideoByExtension = extension ? videoExtensions.includes(extension) : false;
  
  // Check if it's a video by content type
  const isVideoByContentType = contentType.startsWith('video/');
  
  // Determine if it's a video
  const isVideo = isVideoByContentType || (originalContentType === 'application/octet-stream' && isVideoByExtension);
  
  // Check if it's an image
  const isImage = contentType.startsWith('image/');
  
  if (!isVideo && !isImage) {
    return { 
      valid: false, 
      error: 'Unsupported file type. Please upload a video or image file.' 
    };
  }

  // Additional validation for video formats
  if (isVideo) {
    // If it's octet-stream but has a valid video extension, we'll consider it valid
    if (originalContentType === 'application/octet-stream' && isVideoByExtension) {
      return { 
        valid: true, 
        type: 'video' 
      };
    }
    
    // For properly typed videos, check if the content type is one we support
    const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska'];
    
    if (!supportedVideoTypes.includes(contentType) && !isVideoByExtension) {
      return { 
        valid: false, 
        error: 'Unsupported video format. Please use MP4, WebM, MOV, AVI, WMV, or MKV formats.' 
      };
    }
  }

  return { 
    valid: true, 
    type: isVideo ? 'video' : 'image' 
  };
};

/**
 * Determines file orientation (horizontal or vertical)
 */
export const determineFileOrientation = async (file: File, mediaType: 'image' | 'video'): Promise<string> => {
  let orientation = 'horizontal';
  
  try {
    if (mediaType === 'image') {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      orientation = img.naturalHeight > img.naturalWidth ? 'vertical' : 'horizontal';
      URL.revokeObjectURL(img.src);
    } 
    else if (mediaType === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      orientation = video.videoHeight > video.videoWidth ? 'vertical' : 'horizontal';
      URL.revokeObjectURL(video.src);
    }
  } catch (error) {
    console.warn('Could not determine orientation:', error);
  }
  
  return orientation;
};

/**
 * Gets the duration of a video file
 */
export const getVideoDuration = async (file: File): Promise<number | undefined> => {
  try {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });
    const duration = Math.round(video.duration);
    URL.revokeObjectURL(video.src);
    return duration;
  } catch (error) {
    console.warn('Could not determine video duration:', error);
    return undefined;
  }
};
