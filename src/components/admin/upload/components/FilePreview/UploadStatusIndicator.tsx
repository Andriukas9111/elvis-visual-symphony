
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface UploadStatusIndicatorProps {
  status: 'success' | 'error';
  itemVariants: any;
  prefersReducedMotion: boolean;
}

const UploadStatusIndicator: React.FC<UploadStatusIndicatorProps> = ({
  status,
  itemVariants,
  prefersReducedMotion
}) => {
  if (status === 'success') {
    return (
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
    );
  }
  
  return (
    <motion.div 
      className="flex items-center text-red-500 space-x-2"
      variants={prefersReducedMotion ? {} : itemVariants}
    >
      <AlertCircle className="h-5 w-5" />
      <span>Upload failed</span>
    </motion.div>
  );
};

export default UploadStatusIndicator;
