
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUploader } from '@/hooks/admin/useFileUploader';
import UploadPrompt from './components/UploadPrompt';
import FilePreview from './components/FilePreview';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import { Button } from '@/components/ui/button';
import { Loader2, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    uploadProgress, 
    uploadStatus, 
    isUploading,
    uploadFile,
    clearUploadState,
    MAX_VIDEO_SIZE,
    SUPABASE_STORAGE_LIMIT
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
  
  // Check if file size exceeds Supabase storage limits
  useEffect(() => {
    if (file) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      if (file.size > SUPABASE_STORAGE_LIMIT) {
        setSizeWarning(`This file (${fileSizeMB}MB) exceeds typical Supabase storage limits (50MB). Upload may fail unless your storage limit has been increased.`);
      } else {
        setSizeWarning(null);
      }
    } else {
      setSizeWarning(null);
    }
  }, [file, SUPABASE_STORAGE_LIMIT]);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      console.log(`File selected: ${selectedFile.name}, size: ${fileSizeMB}MB`);
      
      setFile(selectedFile);
    }
  }, []);
  
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    maxSize: MAX_VIDEO_SIZE,
    accept: {
      'image/*': [],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.mkv']
    },
    onDropRejected: (rejections) => {
      console.log('File rejected:', rejections);
      if (rejections[0]?.errors[0]?.code === 'file-too-large') {
        const fileSizeMB = (rejections[0].file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (MAX_VIDEO_SIZE / (1024 * 1024)).toFixed(0);
        toast({
          title: 'File too large',
          description: `The file (${fileSizeMB}MB) exceeds the maximum size of ${maxSizeMB}MB.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Invalid file',
          description: rejections[0]?.errors[0]?.message || 'Please select a valid image or video file.',
          variant: 'destructive',
        });
      }
    }
  });
  
  // Handle upload
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      console.log(`Starting upload process for ${file.name}`);
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
    setSizeWarning(null);
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
          <UploadPrompt onFileSelect={open} maxFileSize={MAX_VIDEO_SIZE} />
        ) : (
          <div className="space-y-6">
            {sizeWarning && (
              <Alert variant="warning" className="bg-amber-900/30 border-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Upload Warning</AlertTitle>
                <AlertDescription>{sizeWarning}</AlertDescription>
              </Alert>
            )}
            
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
