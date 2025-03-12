
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import FileMetadata from './FilePreview/FileMetadata';
import LargeFileWarning from './FilePreview/LargeFileWarning';
import ProgressIndicator from './FilePreview/ProgressIndicator';
import UploadStatusIndicator from './FilePreview/UploadStatusIndicator';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploadProgress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  uploadProgress = 0,
  uploadStatus = 'idle',
}) => {
  const { prefersReducedMotion } = useAnimation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Check if file is large (over 50MB)
  const isLargeFile = file.size > 50 * 1024 * 1024;
  
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      key="file-preview"
      className="w-full"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={prefersReducedMotion ? {} : {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            when: "beforeChildren",
            staggerChildren: 0.1,
            duration: 0.3
          }
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <FileMetadata 
          file={file}
          isLargeFile={isLargeFile}
          itemVariants={itemVariants}
          prefersReducedMotion={prefersReducedMotion}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-elvis-pink/10 hover:text-elvis-pink transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {isLargeFile && uploadStatus === 'idle' && (
        <LargeFileWarning 
          file={file}
          itemVariants={itemVariants}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
      
      {previewUrl && (
        <motion.div 
          className="mb-3 overflow-hidden rounded-md"
          variants={prefersReducedMotion ? {} : itemVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {file.type.startsWith('image/') ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-elvis-dark flex items-center justify-center">
              <div className="flex items-center justify-center">
                <FileIcon className="h-16 w-16 text-white/30" />
                <span className="ml-2 text-white/70">{file.name.split('.').pop()?.toUpperCase()} file</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {uploadStatus === 'uploading' && (
        <ProgressIndicator
          uploadProgress={uploadProgress}
          isLargeFile={isLargeFile}
          itemVariants={itemVariants}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      {(uploadStatus === 'success' || uploadStatus === 'error') && (
        <UploadStatusIndicator
          status={uploadStatus}
          itemVariants={itemVariants}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </motion.div>
  );
};

// File icon component for non-image files
const FileIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default FilePreview;
