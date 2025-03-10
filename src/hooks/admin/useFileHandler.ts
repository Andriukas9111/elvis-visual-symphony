
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseFileHandlerOptions {
  onFileSelected?: (selectedFile: File) => void;
}

export const useFileHandler = (options?: UseFileHandlerOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Get file extension
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Check if it's a video by extension regardless of MIME type
      const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
      const isVideoByExtension = fileExt && videoExtensions.includes(fileExt);
      
      // Validate file type early, allowing for application/octet-stream if extension is valid
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska', 'application/octet-stream'];
      
      if (isVideoByExtension && !validVideoTypes.includes(selectedFile.type)) {
        toast({
          title: 'Unsupported video format',
          description: 'Please upload MP4, WebM, MOV, AVI, WMV, or MKV video formats.',
          variant: 'destructive',
        });
        return;
      }
      
      // If it's a video by extension but has octet-stream type, we'll treat it as a valid video
      if (selectedFile.type === 'application/octet-stream' && !isVideoByExtension) {
        toast({
          title: 'Unsupported file type',
          description: 'Please upload a valid image or video file.',
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type.startsWith('video/') || (selectedFile.type === 'application/octet-stream' && isVideoByExtension)) {
        generateVideoThumbnail(selectedFile);
      } else {
        setPreviewUrl(null);
      }

      if (options?.onFileSelected) {
        options.onFileSelected(selectedFile);
      }
    }
  };

  const generateVideoThumbnail = (videoFile: File) => {
    try {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      
      videoEl.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          videoEl.currentTime = videoEl.duration * 0.25;
          
          videoEl.onseeked = () => {
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            setPreviewUrl(canvas.toDataURL());
            URL.revokeObjectURL(videoEl.src);
          };
        }
      };
      
      videoEl.src = URL.createObjectURL(videoFile);
    } catch (err) {
      console.error('Error generating video preview:', err);
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    file,
    previewUrl,
    fileInputRef,
    handleFileChange,
    clearFile,
  };
};
