
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  determineContentType, 
  validateFileType, 
  determineFileOrientation, 
  getVideoDuration 
} from '@/utils/fileUtils';
import { 
  uploadFileToStorage
} from '@/utils/uploadUtils';
import { supabase } from '@/lib/supabase';

interface UseFileUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

export const useFileUploader = ({ onUploadComplete }: UseFileUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const clearUploadState = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  const validateUploadFile = async (file: File) => {
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

  const processMediaMetadata = async (file: File, mediaType: 'image' | 'video') => {
    // Determine file orientation
    setUploadProgress(85);
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

  const createDatabaseEntry = async (
    publicUrl: string, 
    file: File, 
    mediaType: 'image' | 'video', 
    contentType: string,
    orientation: string,
    mediaDuration?: number
  ) => {
    setUploadProgress(95);
    
    try {
      // Generate a slug from the title
      const title = file.name.split('.')[0];
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Prepare the data for insertion
      const newMedia = {
        title: title,
        url: publicUrl,
        type: mediaType,
        thumbnail_url: null,
        video_url: mediaType === 'video' ? publicUrl : undefined,
        slug: `${slug}-${Date.now().toString().substring(9)}`, // Add timestamp suffix to ensure uniqueness
        orientation: orientation,
        is_published: true,
        is_featured: false,
        file_size: file.size,
        file_format: contentType,
        original_filename: file.name,
        tags: mediaType === 'video' ? ['video'] : ['image'],
        duration: mediaDuration,
        sort_order: 0, // Default sort order
        category: mediaType === 'video' ? 'videos' : 'images', // Default category based on type
      };
      
      // Insert the media entry into the database
      const { data, error } = await supabase
        .from('media')
        .insert(newMedia)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating media entry:', error);
        throw error;
      }
      
      console.log('Media entry created successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to create media entry:', error);
      throw error;
    }
  };

  const handleUploadSuccess = (mediaData: any) => {
    setUploadProgress(100);
    setUploadStatus('success');
    
    toast({
      title: 'Upload successful',
      description: 'Your media has been uploaded successfully.',
    });
    
    onUploadComplete(mediaData);
    
    // Reset the form after a successful upload
    setTimeout(() => {
      clearUploadState();
      setIsUploading(false);
    }, 1500);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(5);

      // Validate the file
      const { contentType, mediaType } = await validateUploadFile(file);
      
      // Upload file to storage with improved error handling
      try {
        setUploadProgress(20);
        const { publicUrl } = await uploadFileToStorage(
          file, 
          contentType, 
          (progress) => setUploadProgress(Math.min(20 + Math.floor(progress * 0.6), 80))
        );
        
        console.log(`File uploaded successfully to storage`);
        
        // Process metadata (orientation, duration)
        const { orientation, mediaDuration } = await processMediaMetadata(file, mediaType);
        
        // Create media entry in database
        const mediaData = await createDatabaseEntry(
          publicUrl,
          file,
          mediaType,
          contentType,
          orientation,
          mediaDuration
        );

        handleUploadSuccess(mediaData);
      } catch (uploadError: any) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error during file upload'}`);
      }
      
    } catch (error: any) {
      console.error('Upload process error:', error.message);
      setUploadStatus('error');
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload the file',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    uploadFile,
    clearUploadState
  };
};
