
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomUploadAreaProps {
  showUploadArea: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomUploadArea: React.FC<CustomUploadAreaProps> = ({
  showUploadArea,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!showUploadArea) return null;
  
  return (
    <motion.div 
      className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
      />
      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-white/40" />
      <p className="text-sm text-white/70 mb-2">Drag and drop a thumbnail image here or click to browse</p>
      <Button 
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Image
      </Button>
    </motion.div>
  );
};

export default CustomUploadArea;
