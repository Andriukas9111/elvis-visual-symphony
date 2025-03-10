
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

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const isVideoFile = file.type.startsWith('video/');
      const storageFolder = isVideoFile ? 'videos' : 'images';
      const filePath = `${storageFolder}/${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading ${isVideoFile ? 'video' : 'image'} file:`, filePath);
      
      // Simulate the start of upload with a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(15);
      
      // For larger files, we'll use a chunked upload approach
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const chunks = Math.ceil(file.size / chunkSize);
      
      if (file.size <= chunkSize) {
        // Small file, use standard upload
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // Allow file replacement
          });

        if (uploadError) throw uploadError;
      } else {
        // Large file, use chunked upload
        let uploadedBytes = 0;
        
        for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
          const chunk = file.slice(start, end);
          
          const uploadOptions = {
            cacheControl: '3600',
            upsert: true
          };
          
          if (chunkIndex > 0) {
            // @ts-ignore - Supabase SDK types don't include offset option properly
            uploadOptions.offset = uploadedBytes;
          }
          
          const { error: chunkError } = await supabase.storage
            .from('media')
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
        .from('media')
        .getPublicUrl(filePath);

      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create a media entry in the database
      const mediaType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'file';
      
      // Get orientation from image/video dimensions
      let orientation = 'horizontal';
      
      if (mediaType === 'image') {
        // For images, create an image element to check dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = () => {
            if (img.height > img.width) {
              orientation = 'vertical';
            } else if (img.height === img.width) {
              orientation = 'square';
            }
            URL.revokeObjectURL(img.src);
            resolve(null);
          };
        });
      }
      
      // Determine if we need to generate a thumbnail for video files
      let thumbnailUrl = null;
      
      if (mediaType === 'image') {
        // For images, use the image itself as the thumbnail
        thumbnailUrl = urlData.publicUrl;
      }
      
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([{
          title: file.name.split('.')[0],
          slug: file.name.split('.')[0].toLowerCase().replace(/\s+/g, '-'),
          description: '',
          type: mediaType,
          category: mediaType === 'video' ? 'video' : 'image',
          url: urlData.publicUrl,
          thumbnail_url: thumbnailUrl,
          orientation: orientation,
          is_published: false,
          tags: mediaType === 'video' ? ['video'] : ['image'],
        }])
        .select()
        .single();

      if (mediaError) throw mediaError;

      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: 'Upload successful',
        description: `Your ${mediaType} has been uploaded successfully.`,
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
