
import React from 'react';
import { AlertTriangle, FileVideo, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import UploadError from './UploadError';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  error?: {
    message: string;
    details?: string;
  };
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  uploadProgress,
  uploadStatus,
  error
}) => {
  const isVideo = file.type.startsWith('video/');
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-elvis-dark/30 rounded-lg border border-white/10">
        <div className="flex items-center space-x-4">
          {isVideo ? (
            <FileVideo className="h-8 w-8 text-elvis-pink" />
          ) : (
            <ImageIcon className="h-8 w-8 text-elvis-pink" />
          )}
          
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-white/60">{fileSizeMB}MB</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {uploadStatus === 'uploading' && (
        <Progress value={uploadProgress} className="h-2 bg-white/10" />
      )}

      {uploadStatus === 'error' && error && (
        <UploadError error={error.message} details={error.details} />
      )}
    </div>
  );
};

export default FilePreview;
