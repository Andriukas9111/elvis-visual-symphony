
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUploader } from '@/hooks/admin/useFileUploader';
import { useToast } from '@/components/ui/use-toast';
import FileUploadContent from './components/FileUploadContent';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    uploadProgress, 
    uploadStatus, 
    isUploading,
    errorDetails,
    uploadFile,
    clearUploadState,
    getFileSizeWarning,
    MAX_FILE_SIZE
  } = useFileUploader({ 
    onUploadComplete
  });
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      console.log(`File selected: ${selectedFile.name}, size: ${fileSizeMB}MB`);
      
      const warning = getFileSizeWarning(selectedFile.size);
      setSizeWarning(warning);
      
      setFile(selectedFile);
    }
  }, [getFileSizeWarning]);
  
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'image/*': [],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.mkv']
    },
    onDropRejected: (rejections) => {
      console.log('File rejected:', rejections);
      if (rejections[0]?.errors[0]?.code === 'file-too-large') {
        const fileSizeMB = (rejections[0].file.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
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
      await uploadFile(file);
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
    setSizeWarning(null);
    clearUploadState();
  };
  
  return (
    <div>
      <div {...getRootProps({ className: 'outline-none' })}>
        <input {...getInputProps()} />
        
        <FileUploadContent
          file={file}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
          sizeWarning={sizeWarning}
          errorDetails={errorDetails}
          isUploading={isUploading}
          onFileSelect={open}
          onCancel={handleCancel}
          onUpload={handleUpload}
          maxFileSize={MAX_FILE_SIZE}
        />
      </div>
    </div>
  );
};

export default FileUploadTab;
