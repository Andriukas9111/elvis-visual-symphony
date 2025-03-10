
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
  const { validateUploadFile } = useFileValidation();
  const { processMediaMetadata } = useMediaProcessor();
  const { createDatabaseEntry } = useMediaDatabase();

  const clearUploadState = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
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
      
      // Show size info for large files
      if (file.size > 50 * 1024 * 1024) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast({
          title: 'Large file detected',
          description: `Uploading ${fileSizeMB}MB file. This may take some time.`,
        });
      }
      
      // Upload file to storage
      setUploadProgress(10);
      const { publicUrl, filePath, bucket } = await uploadFileToStorage(
        file, 
        contentType, 
        (progress) => setUploadProgress(10 + Math.floor(progress * 0.7))
      );
      
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
        mediaDuration
      );

      handleUploadSuccess(mediaData);
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
