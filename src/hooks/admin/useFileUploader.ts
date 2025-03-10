
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { determineContentType, validateFileType, determineFileOrientation, getVideoDuration } from '@/utils/fileUtils';
import { uploadFileToStorage, createMediaEntry } from '@/utils/uploadUtils';

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

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(5);

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
      
      // Upload file to storage with improved error handling
      try {
        setUploadProgress(20);
        const { publicUrl, bucket, filePath } = await uploadFileToStorage(
          file, 
          contentType, 
          (progress) => setUploadProgress(Math.min(20 + Math.floor(progress * 0.6), 80))
        );
        
        console.log(`File uploaded successfully to ${bucket}/${filePath}`);
        
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
        
        // Create media entry in database
        setUploadProgress(95);
        const mediaData = await createMediaEntry({
          title: file.name.split('.')[0],
          url: publicUrl,
          type: mediaType,
          thumbnail_url: null,
          video_url: mediaType === 'video' ? publicUrl : undefined,
          orientation,
          file_size: file.size,
          file_format: contentType,
          original_filename: file.name,
          duration: mediaDuration
        });

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
