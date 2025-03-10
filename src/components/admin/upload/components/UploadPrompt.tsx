
import React from 'react';
import { Upload, Camera, Film } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadPromptProps {
  prefersReducedMotion: boolean;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({ prefersReducedMotion }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

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
      key="upload-prompt"
      className="flex flex-col items-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={prefersReducedMotion ? {} : containerVariants}
    >
      <motion.div 
        className="h-12 w-12 text-white/40 mb-2 rounded-full bg-elvis-medium p-3 flex items-center justify-center"
        variants={prefersReducedMotion ? {} : itemVariants}
        whileHover={{ 
          rotate: [0, -10, 10, -5, 5, 0],
          transition: { duration: 0.5 }
        }}
      >
        <Upload className="h-6 w-6" />
      </motion.div>
      <motion.p 
        className="text-lg font-medium"
        variants={prefersReducedMotion ? {} : itemVariants}
      >
        Drop files here or click to upload
      </motion.p>
      <motion.p 
        className="text-sm text-white/60 mt-1"
        variants={prefersReducedMotion ? {} : itemVariants}
      >
        <span className="inline-flex items-center mr-2">
          <Camera className="h-3 w-3 mr-1" /> Images (up to 10MB)
        </span>
        <span className="inline-flex items-center">
          <Film className="h-3 w-3 mr-1" /> Videos up to 500MB (MP4, WebM, MOV, AVI, WMV, MKV)
        </span>
      </motion.p>
      <motion.p 
        className="text-xs text-white/40 mt-2"
        variants={prefersReducedMotion ? {} : itemVariants}
      >
        Large files will be processed in the background for reliable uploads
      </motion.p>
    </motion.div>
  );
};

export default UploadPrompt;
