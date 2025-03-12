
import React from 'react';
import { motion } from 'framer-motion';

interface FileMetadataProps {
  file: File;
  isLargeFile: boolean;
  itemVariants: any;
  prefersReducedMotion: boolean;
}

const FileMetadata: React.FC<FileMetadataProps> = ({
  file,
  isLargeFile,
  itemVariants,
  prefersReducedMotion
}) => {
  // Format file size with appropriate units
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const fileSizeFormatted = formatFileSize(file.size);

  return (
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
  );
};

export default FileMetadata;
