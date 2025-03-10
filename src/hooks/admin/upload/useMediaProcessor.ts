
import { determineFileOrientation, getVideoDuration } from '@/utils/fileUtils';

export const useMediaProcessor = () => {
  /**
   * Process media file to extract metadata
   * @returns { orientation, mediaDuration }
   */
  const processMediaMetadata = async (file: File, mediaType: 'image' | 'video') => {
    // Determine file orientation
    const orientation = await determineFileOrientation(file, mediaType);
    console.log(`Determined orientation: ${orientation}`);
    
    // For videos, get duration
    let mediaDuration: number | undefined;
    if (mediaType === 'video') {
      mediaDuration = await getVideoDuration(file);
      console.log(`Video duration: ${mediaDuration} seconds`);
    }

    return { orientation, mediaDuration };
  };

  return {
    processMediaMetadata
  };
};
