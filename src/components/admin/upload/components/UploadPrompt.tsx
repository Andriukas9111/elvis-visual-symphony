
import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadPromptProps {
  onFileSelect: () => void;
  maxFileSize: number;
  maxFileSizeFormatted?: string;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({ 
  onFileSelect, 
  maxFileSize,
  maxFileSizeFormatted 
}) => {
  const [formattedSize, setFormattedSize] = useState<string>('Loading...');
  
  useEffect(() => {
    // Use the formatted size if provided, otherwise calculate from bytes
    if (maxFileSizeFormatted) {
      setFormattedSize(maxFileSizeFormatted);
    } else {
      // Format the size nicely from bytes
      const formatSize = (bytes: number): string => {
        if (bytes < 1024 * 1024) {
          return `${(bytes / 1024).toFixed(0)}KB`;
        } else if (bytes < 1024 * 1024 * 1024) {
          return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
        } else {
          return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
        }
      };
      
      setFormattedSize(formatSize(maxFileSize));
    }
  }, [maxFileSize, maxFileSizeFormatted]);
  
  return (
    <div 
      className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8 cursor-pointer hover:border-elvis-pink/50 transition-all duration-300"
      onClick={onFileSelect}
    >
      <div className="mb-4 p-4 bg-white/5 rounded-full">
        <Upload className="h-8 w-8 text-white/40" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Upload Media</h3>
      
      <p className="text-sm text-white/60 text-center mb-4">
        Drag & drop files here, or click to browse
      </p>
      
      <p className="text-xs text-white/40 text-center mb-4">
        Maximum file size: {formattedSize}
      </p>
      
      <p className="text-xs text-white/40 text-center">
        Supported formats: Images (PNG, JPEG, GIF) and Videos (MP4, WebM)
      </p>
      
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFileSelect();
        }}
        className="mt-4"
      >
        <Upload className="h-4 w-4 mr-2" />
        Browse Files
      </Button>
    </div>
  );
};

export default UploadPrompt;
