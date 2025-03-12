
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { uploadFileToStorage } from '@/utils/upload';
import { useFileValidation } from './upload/useFileValidation';
import { useMediaProcessor } from './upload/useMediaProcessor';
import { useMediaDatabase } from './upload/useMediaDatabase';

interface UseFileUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

export const useFileUploader = ({ onUploadComplete }: UseFileUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  
  // Use our refactored hooks
  const { validateUploadFile, MAX_VIDEO_SIZE, MAX_IMAGE_SIZE, SUPABASE_STORAGE_LIMIT } = useFileValidation();
  const { processMediaMetadata } = useMediaProcessor();
  const { createDatabaseEntry } = useMediaDatabase();

  const clearUploadState = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  const handleUploadSuccess = (mediaData: any) => {
    setUploadProgress(100);
    setUploadStatus('success');
    setIsUploading(false);
    
    toast({
      title: 'Upload successful',
      description: 'Your media has been uploaded successfully.',
    });
    
    onUploadComplete(mediaData);
  };

  const uploadFile = async (file: File, thumbnailUrl?: string) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(5);

      // Log file details for debugging
      console.log(`Starting upload for file: ${file.name}, size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      
      // Validate the file
      const { contentType, mediaType } = await validateUploadFile(file);
      
      // Always show size info for large files
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast({
        title: 'Uploading file',
        description: `Starting upload for ${fileSizeMB}MB file. Please wait...`,
      });
      
      // Upload file to storage
      setUploadProgress(10);
      
      // Use simplified storage upload method
      const { publicUrl, filePath, bucket } = await uploadFileToStorage(
        file, 
        contentType
      );
      
      setUploadProgress(70);
      console.log(`File uploaded successfully to storage (${bucket}/${filePath})`);
      
      // Process metadata (orientation, duration)
      setUploadProgress(85);
      const { orientation, mediaDuration } = await processMediaMetadata(file, mediaType);
      
      // Create media entry in database
      setUploadProgress(95);
      const mediaData = await createDatabaseEntry(
        publicUrl,
        file,
        mediaType,
        contentType,
        orientation,
        bucket,
        filePath,
        mediaDuration,
        false,
        undefined,
        thumbnailUrl
      );

      handleUploadSuccess(mediaData);
      
      // Return the media data for further processing (e.g., thumbnail generation)
      return mediaData;
      
    } catch (error: any) {
      console.error('Upload process error:', error.message);
      setUploadStatus('error');
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload the file',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    uploadFile,
    clearUploadState,
    MAX_VIDEO_SIZE,
    MAX_IMAGE_SIZE,
    SUPABASE_STORAGE_LIMIT
  };
};
