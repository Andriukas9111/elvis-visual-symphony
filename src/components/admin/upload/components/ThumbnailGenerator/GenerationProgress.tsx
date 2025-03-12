
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface GenerationProgressProps {
  isGenerating: boolean;
  generationProgress: number;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  isGenerating,
  generationProgress
}) => {
  if (!isGenerating) return null;
  
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Progress value={generationProgress} className="h-2 bg-elvis-medium" />
      <p className="text-xs text-white/60">
        {generationProgress < 30 
          ? 'Preparing thumbnail generation...' 
          : generationProgress < 70
            ? 'Generating thumbnails from video frames...'
            : 'Processing and uploading thumbnails...'}
      </p>
    </motion.div>
  );
};

export default GenerationProgress;
