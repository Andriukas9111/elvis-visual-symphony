
// Re-exporting all thumbnail functions from their respective modules
// This ensures backward compatibility while maintaining a cleaner code structure

import { generateThumbnailsFromVideo } from './thumbnails/generator';
import { uploadThumbnails } from './thumbnails/uploader';
import { updateMediaThumbnail, requestServerThumbnailGeneration } from './thumbnails/api';

export {
  generateThumbnailsFromVideo,
  uploadThumbnails,
  updateMediaThumbnail,
  requestServerThumbnailGeneration
};
