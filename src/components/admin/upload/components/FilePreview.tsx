
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, AlertCircle, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilePreviewProps {
  file: File;
  previewUrl: string | null;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  clearFile: () => void;
  prefersReducedMotion: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  previewUrl,
  uploadProgress,
  uploadStatus,
  clearFile,
  prefersReducedMotion,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Format file size with appropriate units
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Determine if file size is large (over 100MB) 
  const isLargeFile = file.size > 100 * 1024 * 1024;
  const fileSizeFormatted = formatFileSize(file.size);
  
  // Format estimated upload time (very rough estimate)
  const getEstimatedTime = (): string => {
    // Assuming 1MB/s upload speed as a conservative estimate
    const seconds = file.size / (1024 * 1024) / 1;
    if (seconds < 60) return `~${Math.ceil(seconds)} seconds`;
    if (seconds < 3600) return `~${Math.ceil(seconds / 60)} minutes`;
    return `~${(seconds / 3600).toFixed(1)} hours`;
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
        <motion.div 
          className="flex items-center space-x-2"
          variants={prefersReducedMotion ? {} : itemVariants}
        >
          <div className="font-medium truncate max-w-[200px]">{file.name}</div>
          <div className={`text-sm ${isLargeFile ? 'text-amber-400' : 'text-white/60'}`}>
            ({fileSizeFormatted})
          </div>
          <div className="text-xs text-white/40 bg-elvis-medium px-2 py-0.5 rounded">
            {file.type.split('/')[0]}
          </div>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-elvis-pink/10 hover:text-elvis-pink transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            clearFile();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {isLargeFile && uploadStatus === 'idle' && (
        <motion.div 
          className="mb-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm"
          variants={prefersReducedMotion ? {} : itemVariants}
        >
          <p>Large file detected! Upload may take {getEstimatedTime()}.</p>
          <p className="text-xs mt-1">Please keep this window open during upload.</p>
        </motion.div>
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
              <FileIcon className="h-16 w-16 text-white/30" />
              <span className="ml-2 text-white/70">{file.name.split('.').pop()?.toUpperCase()} file</span>
            </div>
          )}
        </motion.div>
      )}
      
      {uploadStatus === 'uploading' && (
        <motion.div 
          className="space-y-2"
          variants={prefersReducedMotion ? {} : itemVariants}
        >
          <Progress 
            value={uploadProgress} 
            className="h-2 bg-elvis-medium" 
          />
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">
              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
            </span>
            <span className="text-white/60">{uploadProgress}%</span>
          </div>
        </motion.div>
      )}

      {uploadStatus === 'success' && (
        <motion.div 
          className="flex items-center text-green-500 space-x-2"
          variants={prefersReducedMotion ? {} : {
            hidden: { scale: 0.8, opacity: 0 },
            visible: { 
              scale: 1, 
              opacity: 1,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 15 
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Upload complete</span>
        </motion.div>
      )}

      {uploadStatus === 'error' && (
        <motion.div 
          className="flex items-center text-red-500 space-x-2"
          variants={prefersReducedMotion ? {} : itemVariants}
        >
          <AlertCircle className="h-5 w-5" />
          <span>Upload failed</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilePreview;
