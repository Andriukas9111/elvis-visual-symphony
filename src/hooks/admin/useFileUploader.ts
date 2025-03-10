
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
      setUploadProgress(5); // Start progress indicator

      // Improved MIME type detection and validation
      let fileType = file.type;
      
      // For application/octet-stream, try to determine type from extension
      if (fileType === 'application/octet-stream' || !fileType) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension) {
          // Map common video extensions to MIME types
          const extensionMimeMap: Record<string, string> = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'wmv': 'video/x-ms-wmv',
            'mkv': 'video/x-matroska',
          };
          
          if (extensionMimeMap[extension]) {
            fileType = extensionMimeMap[extension];
            console.log(`Detected MIME type from extension: ${fileType}`);
          }
        }
      }
      
      // Validate file type
      if (fileType.startsWith('video/') && !['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska'].includes(fileType)) {
        throw new Error(`Unsupported video format: ${fileType}. Please use MP4, WebM, QuickTime, AVI, WMV, or MKV formats.`);
      }
      
      // If we still don't have a valid video MIME type, reject the upload
      if (fileType === 'application/octet-stream') {
        throw new Error('Could not determine file type. Please ensure you are uploading a supported video format (MP4, WebM, MOV, AVI, WMV, MKV).');
      }

      // Generate a unique filename with the original extension
      const fileExt = file.name.split('.').pop();
      const uniqueId = uuidv4();
      const filePath = `${uniqueId}.${fileExt}`;
      const bucket = fileType.startsWith('video/') ? 'videos' : 'media';
      
      console.log(`Uploading ${fileType} to ${bucket} bucket: ${filePath}`);
      
      // Simulate the start of upload with a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(15);
      
      // For larger files, use a chunked upload approach
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      if (file.size <= chunkSize) {
        // Small file, use standard upload
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: fileType, // Explicitly set the content type
          });

        if (uploadError) throw uploadError;
      } else {
        // Large file, use chunked upload
        let uploadedBytes = 0;
        
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
          const chunk = file.slice(start, end);
          
          const uploadOptions = {
            cacheControl: '3600',
            upsert: true,
            contentType: fileType, // Explicitly set the content type
          };
          
          if (chunkIndex > 0) {
            // @ts-ignore - Supabase SDK types don't include offset option properly
            uploadOptions.offset = uploadedBytes;
          }
          
          const { error: chunkError } = await supabase.storage
            .from(bucket)
            .upload(filePath, chunk, uploadOptions);
            
          if (chunkError) throw chunkError;
          
          uploadedBytes += (end - start);
          setUploadProgress(15 + Math.round((uploadedBytes / file.size) * 45));
        }
      }
      
      // Simulate processing time for better UX
      setUploadProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Determine file orientation (for videos and images)
      let orientation = 'horizontal';
      if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
        try {
          // For images we can check directly
          if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            orientation = img.naturalHeight > img.naturalWidth ? 'vertical' : 'horizontal';
            URL.revokeObjectURL(img.src);
          } 
          // For videos we need a video element
          else if (fileType.startsWith('video/')) {
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
      }

      console.log(`Determined orientation: ${orientation}`);

      // Create a media entry in the database
      const mediaType = fileType.startsWith('image/') ? 'image' : 
                        fileType.startsWith('video/') ? 'video' : 'file';
      
      let mediaDuration: number | undefined;
      
      // Try to get video duration for video files
      if (mediaType === 'video') {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
          });
          mediaDuration = Math.round(video.duration);
          URL.revokeObjectURL(video.src);
        } catch (error) {
          console.warn('Could not determine video duration:', error);
        }
      }
      
      const mediaInsertData: any = {
        title: file.name.split('.')[0],
        slug: file.name.split('.')[0].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: '',
        type: mediaType,
        category: 'uncategorized',
        url: urlData.publicUrl,
        thumbnail_url: mediaType === 'image' ? urlData.publicUrl : null,
        is_published: false,
        orientation,
        file_size: file.size,
        file_format: fileType, // Use the corrected filetype
        original_filename: file.name,
        processing_status: 'completed',
      };

      // If it's a video, set the video_url to the same URL
      if (mediaType === 'video') {
        mediaInsertData.video_url = urlData.publicUrl;
        
        // Add duration if available
        if (mediaDuration) {
          mediaInsertData.duration = mediaDuration;
        }
      }
      
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([mediaInsertData])
        .select()
        .single();

      if (mediaError) throw mediaError;

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
      
    } catch (error: any) {
      console.error('Upload error:', error.message);
      setUploadStatus('error');
      toast({
        title: 'Upload failed',
        description: error.message,
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
