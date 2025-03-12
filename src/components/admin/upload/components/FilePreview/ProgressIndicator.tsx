
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  uploadProgress: number;
  isLargeFile: boolean;
  itemVariants: any;
  prefersReducedMotion: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  uploadProgress,
  isLargeFile,
  itemVariants,
  prefersReducedMotion
}) => {
  return (
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
          {uploadProgress < 95 
            ? 'Uploading...'
            : 'Processing...'}
        </span>
        <span className="text-white/60">{uploadProgress}%</span>
      </div>
      {isLargeFile && uploadProgress < 95 && (
        <div className="text-xs text-white/40 mt-1">
          Large file upload in progress, please be patient
        </div>
      )}
    </motion.div>
  );
};

export default ProgressIndicator;
