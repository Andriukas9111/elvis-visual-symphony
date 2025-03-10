
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { useFileUploader } from '@/hooks/admin/useFileUploader';
import FilePreview from './components/FilePreview';
import UploadPrompt from './components/UploadPrompt';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { prefersReducedMotion } = useAnimation();
  
  const {
    uploadProgress,
    uploadStatus,
    isUploading,
    uploadFile,
    clearUploadState
  } = useFileUploader({ onUploadComplete });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Get file extension
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Check if it's a video by extension regardless of MIME type
      const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv'];
      const isVideoByExtension = fileExt && videoExtensions.includes(fileExt);
      
      // Validate file type early, allowing for application/octet-stream
      if ((selectedFile.type.startsWith('video/') || isVideoByExtension) && 
          !['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska', 'application/octet-stream'].includes(selectedFile.type)) {
        toast({
          title: 'Unsupported video format',
          description: 'Please upload MP4, WebM, MOV, AVI, WMV, or MKV video formats.',
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
      } else if (selectedFile.type.startsWith('video/') || isVideoByExtension) {
        generateVideoThumbnail(selectedFile);
      } else {
        setPreviewUrl(null);
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
    clearUploadState();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? {} : {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.3 }
        }
      }}
    >
      <motion.div 
        className={`flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 cursor-pointer hover:border-elvis-pink/50 transition-all duration-300 ${previewUrl ? 'hover:shadow-pink-glow/10' : ''}`}
        whileHover={{ scale: 1.01 }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/x-matroska,.mp4,.webm,.mov,.avi,.wmv,.mkv"
        />
        
        <AnimatePresence mode="wait">
          {!file ? (
            <UploadPrompt prefersReducedMotion={prefersReducedMotion} />
          ) : (
            <FilePreview
              file={file}
              previewUrl={previewUrl}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
              clearFile={clearFile}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {file && uploadStatus !== 'success' && (
        <motion.div
          variants={prefersReducedMotion ? {} : {
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 24 }
            }
          }}
          className="mt-4"
        >
          <Button 
            className="w-full bg-elvis-pink hover:bg-elvis-pink/80 shadow-pink-glow/30 hover:shadow-pink-glow/50 transition-all duration-300"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUploadTab;
