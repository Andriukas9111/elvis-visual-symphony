
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUploader } from '@/hooks/admin/useFileUploader';
import UploadPrompt from './components/UploadPrompt';
import FilePreview from './components/FilePreview';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import { Button } from '@/components/ui/button';
import { Loader2, X, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  
  const { 
    uploadProgress, 
    uploadStatus, 
    isUploading,
    uploadFile,
    clearUploadState
  } = useFileUploader({ 
    onUploadComplete: (mediaData) => {
      // Store the video ID and URL for thumbnail generation
      if (mediaData && mediaData.type === 'video') {
        setUploadedVideoId(mediaData.id);
        setUploadedVideoUrl(mediaData.url);
      }
      onUploadComplete(mediaData);
    }
  });
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: {
      'image/*': [],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.mkv']
    }
  });
  
  // Handle upload
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      await uploadFile(file, selectedThumbnail || undefined);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setFile(null);
    setSelectedThumbnail(null);
    clearUploadState();
  };
  
  // Handle thumbnail selection
  const handleThumbnailSelected = (thumbnailUrl: string) => {
    setSelectedThumbnail(thumbnailUrl);
  };
  
  return (
    <div>
      <div {...getRootProps({ className: 'outline-none' })}>
        <input {...getInputProps()} />
        
        {!file ? (
          <UploadPrompt onFileSelect={open} />
        ) : (
          <div className="space-y-6">
            <FilePreview 
              file={file}
              onRemove={handleCancel}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
            />
            
            {file.type.startsWith('video/') && uploadStatus === 'idle' && (
              <ThumbnailGenerator
                videoFile={file}
                onThumbnailSelected={handleThumbnailSelected}
              />
            )}
            
            {uploadStatus === 'success' && file.type.startsWith('video/') && uploadedVideoId && uploadedVideoUrl && (
              <ThumbnailGenerator
                videoFile={null}
                videoId={uploadedVideoId}
                videoUrl={uploadedVideoUrl}
                onThumbnailSelected={handleThumbnailSelected}
              />
            )}
            
            {uploadStatus === 'idle' && (
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-white/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                
                <Button
                  type="button"
                  onClick={handleUpload}
                  className="bg-elvis-pink hover:bg-elvis-pink/80"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Upload</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadTab;
