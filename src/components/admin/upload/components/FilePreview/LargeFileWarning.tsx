
import React from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface LargeFileWarningProps {
  file: File;
  itemVariants: any;
  prefersReducedMotion: boolean;
}

const LargeFileWarning: React.FC<LargeFileWarningProps> = ({
  file,
  itemVariants,
  prefersReducedMotion
}) => {
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
      className="mb-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 text-sm"
      variants={prefersReducedMotion ? {} : itemVariants}
    >
      <p className="flex items-center">
        <Upload className="h-3 w-3 mr-1" />
        <span>
          Large file detected! Upload may take longer.
        </span>
      </p>
      <p className="text-xs mt-1">
        Estimated upload time: {getEstimatedTime()}. Please keep this window open.
      </p>
    </motion.div>
  );
};

export default LargeFileWarning;
