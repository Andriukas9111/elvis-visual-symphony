
import { useState, useEffect } from 'react';
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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [actualStorageLimit, setActualStorageLimit] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Use our refactored hooks
  const { validateUploadFile, checkSupabaseStorageLimit, MAX_VIDEO_SIZE, MAX_IMAGE_SIZE, DEFAULT_SUPABASE_STORAGE_LIMIT } = useFileValidation();
  const { processMediaMetadata } = useMediaProcessor();
  const { createDatabaseEntry } = useMediaDatabase();

  // Check actual storage limits on mount
  useEffect(() => {
    const checkLimits = async () => {
      const limit = await checkSupabaseStorageLimit();
      setActualStorageLimit(limit);
      console.log(`Detected actual Supabase storage limit: ${(limit / (1024 * 1024)).toFixed(0)}MB`);
    };
    
    checkLimits();
  }, []);
  
  const clearUploadState = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorDetails(null);
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
      setErrorDetails(null);

      // Log file details for debugging
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`Starting upload for file: ${file.name}, size: ${fileSizeMB}MB`);
      
      // Validate the file
      const { contentType, mediaType, sizeWarning } = await validateUploadFile(file);
      
      // Set warning for files that might exceed Supabase limits
      if (sizeWarning) {
        setErrorDetails(sizeWarning);
      }
      
      // Show toast with file size info
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
      
      // Set detailed error message
      setErrorDetails(error.message);
      
      // Show error toast with more helpful message
      const errorMessage = error.message || 'Failed to upload the file';
      let actionMessage = '';
      
      if (errorMessage.includes('maximum allowed size') || errorMessage.includes('exceeds')) {
        const limitMB = actualStorageLimit ? (actualStorageLimit / (1024 * 1024)).toFixed(0) : '50';
        actionMessage = `The current server limit is ${limitMB}MB. To upload larger files, edit supabase/config.toml and set 'file_size_limit' to a higher value like "1000MiB".`;
      }
      
      toast({
        title: 'Upload failed',
        description: errorMessage + (actionMessage ? `\n\n${actionMessage}` : ''),
        variant: 'destructive',
      });
      
      return null;
    }
  };

  // Calculate if a file would be problematic based on size
  const getFileSizeWarning = (fileSize: number): string | null => {
    const limit = actualStorageLimit || DEFAULT_SUPABASE_STORAGE_LIMIT;
    if (fileSize > limit) {
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      const limitMB = (limit / (1024 * 1024)).toFixed(0);
      return `File size (${fileSizeMB}MB) exceeds the server storage limit (${limitMB}MB). Upload will likely fail. Increase the limit in supabase/config.toml.`;
    }
    return null;
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    errorDetails,
    actualStorageLimit,
    uploadFile,
    clearUploadState,
    getFileSizeWarning,
    MAX_VIDEO_SIZE,
    MAX_IMAGE_SIZE
  };
};
