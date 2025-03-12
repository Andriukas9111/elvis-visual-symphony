
import React, { useState, useRef } from 'react';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import FileUploadContent from './components/FileUploadContent';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploadVideo,
    isUploading,
    uploadProgress,
    error,
    resetUpload
  } = useVideoUpload();
  
  // 10 GB in bytes as maximum theoretical limit
  const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024;
  const MAX_FILE_SIZE_FORMATTED = '10GB';
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setSizeWarning(`File is too large. Maximum size is ${MAX_FILE_SIZE_FORMATTED}.`);
      } else {
        setSizeWarning(null);
      }
      
      setFile(selectedFile);
      // Reset the upload state for a new file
      resetUpload();
    }
  };
  
  const handleCancel = () => {
    setFile(null);
    setSizeWarning(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      const mediaId = uuidv4();
      
      const media = await uploadVideo(file, {
        title: file.name.split('.')[0],
        is_published: true,
        orientation: 'horizontal' // Default orientation
      });
      
      if (media) {
        onUploadComplete(media);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*"
      />
      
      <FileUploadContent 
        file={file}
        uploadProgress={uploadProgress}
        uploadStatus={isUploading ? 'uploading' : error ? 'error' : uploadProgress === 100 ? 'success' : 'idle'}
        sizeWarning={sizeWarning}
        errorDetails={error ? { message: error } : null}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        onCancel={handleCancel}
        onUpload={handleUpload}
        maxFileSize={MAX_FILE_SIZE}
        maxFileSizeFormatted={MAX_FILE_SIZE_FORMATTED}
      />
    </div>
  );
};

export default FileUploadTab;
