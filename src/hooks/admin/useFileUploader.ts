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
  const [errorDetails, setErrorDetails] = useState<{ message: string; details?: string } | null>(null);
  const [actualStorageLimit, setActualStorageLimit] = useState<number | null>(null);
  const { toast } = useToast();
  
  const { validateUploadFile, checkSupabaseStorageLimit, MAX_VIDEO_SIZE, MAX_IMAGE_SIZE, DEFAULT_SUPABASE_STORAGE_LIMIT } = useFileValidation();
  const { processMediaMetadata } = useMediaProcessor();
  const { createDatabaseEntry } = useMediaDatabase();

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

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`Starting upload for file: ${file.name}, size: ${fileSizeMB}MB`);
      
      const { contentType, mediaType, sizeWarning } = await validateUploadFile(file);
      
      if (sizeWarning) {
        setErrorDetails(sizeWarning);
      }
      
      toast({
        title: 'Uploading file',
        description: `Starting upload for ${fileSizeMB}MB file. Please wait...`,
      });
      
      setUploadProgress(10);
      
      try {
        const { publicUrl, filePath, bucket } = await uploadFileToStorage(
          file, 
          contentType
        );
        
        setUploadProgress(70);
        console.log(`File uploaded successfully to storage (${bucket}/${filePath})`);
        
        setUploadProgress(85);
        const { orientation, mediaDuration } = await processMediaMetadata(file, mediaType);
        
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
        return mediaData;
        
      } catch (error: any) {
        let errorMessage = 'Failed to upload file';
        let errorDetails = undefined;
        
        if (error.message.includes('exceeded') || error.message.includes('too large')) {
          errorMessage = `File size (${fileSizeMB}MB) exceeds the server limit`;
          errorDetails = 'Please try reducing the file size or contact the administrator to increase the limit.';
        } else if (error.statusCode === '500') {
          errorMessage = 'Server error during upload';
          errorDetails = error.message;
        }
        
        setErrorDetails({
          message: errorMessage,
          details: errorDetails
        });
        
        setUploadStatus('error');
        throw error;
      }
      
    } catch (error: any) {
      console.error('Upload process error:', error);
      setUploadStatus('error');
      setIsUploading(false);
      
      if (!errorDetails) {
        setErrorDetails({
          message: error.message || 'Failed to upload the file',
          details: error.details
        });
      }
      
      toast({
        title: 'Upload failed',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive',
      });
      
      return null;
    }
  };

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
