
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createMediaEntry } from '@/utils/upload/mediaDatabase';
import { v4 as uuidv4 } from 'uuid';
import { getStorageConfig } from '@/lib/supabase';

// Default maximum file size (50MB in bytes) - used as fallback
const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024;

interface UseFileUploaderProps {
  onUploadComplete?: (mediaData: any) => void;
}

export const useFileUploader = ({ onUploadComplete }: UseFileUploaderProps = {}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<{ message: string; details?: string } | null>(null);
  const [MAX_FILE_SIZE, setMaxFileSize] = useState(DEFAULT_MAX_FILE_SIZE);
  const { toast } = useToast();
  
  // Fetch the storage configuration from Supabase
  useEffect(() => {
    const fetchStorageConfig = async () => {
      try {
        const config = await getStorageConfig();
        if (config && config.fileSizeLimit) {
          console.log(`Using Supabase storage limit: ${config.fileSizeLimitFormatted}`);
          setMaxFileSize(config.fileSizeLimit);
        } else {
          console.log(`Using default file size limit: ${DEFAULT_MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }
      } catch (error) {
        console.error('Error fetching storage config:', error);
      }
    };
    
    fetchStorageConfig();
  }, []);
  
  const clearUploadState = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorDetails(null);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(10);
      setErrorDetails(null);

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`Starting upload for file: ${file.name}, size: ${fileSizeMB}MB`);
      
      // Determine file type (image or video)
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      
      // Create a unique ID for the file
      const fileId = uuidv4();
      
      // Set up the media data
      const mediaData = {
        id: fileId,
        title: file.name.split('.')[0], // Use filename as initial title
        type: fileType,
        file: file,
        is_published: false,
        is_featured: false,
        tags: [],
        category: fileType === 'image' ? 'photos' : 'videos',
        orientation: fileType === 'image' ? 'horizontal' : 'horizontal', // Default
      };
      
      setUploadProgress(30);
      
      // Create the media entry in the database
      console.log('Creating media entry with data:', mediaData);
      try {
        const result = await createMediaEntry(mediaData);
        
        setUploadProgress(100);
        setUploadStatus('success');
        
        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded successfully.`,
        });
        
        if (onUploadComplete) {
          onUploadComplete(result);
        }
        
        return result;
      } catch (error: any) {
        console.error('Media entry creation error:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Upload process error:', error);
      setUploadStatus('error');
      
      setErrorDetails({
        message: error.message || 'Failed to upload the file',
        details: error.details || error.stack
      });
      
      toast({
        title: 'Upload failed',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const getFileSizeWarning = (fileSize: number): string | null => {
    if (fileSize > MAX_FILE_SIZE) {
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      const limitMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return `File size (${fileSizeMB}MB) exceeds the default limit (${limitMB}MB).`;
    }
    
    if (fileSize > MAX_FILE_SIZE * 0.8) {
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      const limitMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return `File size (${fileSizeMB}MB) is approaching the limit (${limitMB}MB).`;
    }
    
    return null;
  };

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    errorDetails,
    uploadFile,
    clearUploadState,
    getFileSizeWarning,
    MAX_FILE_SIZE
  };
};
