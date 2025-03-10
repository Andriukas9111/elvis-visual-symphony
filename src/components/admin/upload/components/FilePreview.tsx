
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
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
          <div className="text-sm text-white/60">
            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
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
      
      {previewUrl && (
        <motion.div 
          className="mb-3 overflow-hidden rounded-md"
          variants={prefersReducedMotion ? {} : itemVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
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
          <div className="text-sm text-white/60 text-right">
            {uploadProgress}%
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
