
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface UploadPromptProps {
  onFileSelect: () => void;
  maxFileSize?: number;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({ onFileSelect, maxFileSize = 1000 * 1024 * 1024 }) => {
  const maxFileSizeMB = Math.floor(maxFileSize / (1024 * 1024));

  return (
    <div 
      className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-6 bg-elvis-dark/30 hover:bg-elvis-dark/50 transition-colors"
    >
      <div className="bg-elvis-pink/10 p-4 rounded-full">
        <UploadCloud className="h-10 w-10 text-white" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Media</h3>
        <p className="text-sm text-white/60">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-white/40">
          Supported formats: MP4, WebM, MOV, JPG, PNG, GIF, WEBP
          <br />
          Max file size: {maxFileSizeMB}MB for videos, 30MB for images
        </p>
      </div>
      
      <Button 
        onClick={onFileSelect}
        type="button"
        className="bg-elvis-pink hover:bg-elvis-pink/80"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Select Files
      </Button>
    </div>
  );
};

export default UploadPrompt;
