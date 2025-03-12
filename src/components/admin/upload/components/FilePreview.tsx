
import React from 'react';
import { X, File, Image, Video, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  error: { message: string; details?: string } | null;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  uploadProgress,
  uploadStatus,
  error
}) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const filePreviewUrl = URL.createObjectURL(file);
  const fileSize = (file.size / (1024 * 1024)).toFixed(2);
  
  // Clean up the URL on component unmount
  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  return (
    <div className="flex flex-col bg-elvis-light border border-white/10 rounded-lg overflow-hidden">
      <div className="p-3 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          {isImage ? <Image className="h-4 w-4" /> : isVideo ? <Video className="h-4 w-4" /> : <File className="h-4 w-4" />}
          <span className="font-medium truncate">{file.name}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full hover:bg-white/10" 
          onClick={onRemove}
          disabled={uploadStatus === 'uploading'}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex items-center justify-center">
          {isImage ? (
            <img 
              src={filePreviewUrl} 
              alt={file.name} 
              className="max-w-full max-h-48 rounded object-contain" 
            />
          ) : isVideo ? (
            <video 
              src={filePreviewUrl} 
              controls 
              className="max-w-full max-h-48 rounded" 
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-white/5 rounded">
              <File className="h-12 w-12 text-white/40" />
            </div>
          )}
        </div>
        
        <div className="md:col-span-2 flex flex-col justify-center space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-white/60">Type:</span> {file.type || 'Unknown'}
            </div>
            <div>
              <span className="text-white/60">Size:</span> {fileSize} MB
            </div>
          </div>
          
          {uploadStatus === 'uploading' && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {uploadStatus === 'error' && error && (
            <div className="flex items-center text-red-400 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>Error: {error.message}</span>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex items-center text-green-400 text-sm">
              <span>Upload complete!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
