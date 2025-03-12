
import React from 'react';
import UploadPrompt from './UploadPrompt';
import FilePreview from './FilePreview';
import UploadWarnings from './UploadWarnings';
import UploadActions from './UploadActions';

interface FileUploadContentProps {
  file: File | null;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  sizeWarning: string | null;
  errorDetails: { message: string; details?: string } | null;
  isUploading: boolean;
  onFileSelect: () => void;
  onCancel: () => void;
  onUpload: () => void;
  maxFileSize: number;
  maxFileSizeFormatted?: string;
}

const FileUploadContent: React.FC<FileUploadContentProps> = ({
  file,
  uploadProgress,
  uploadStatus,
  sizeWarning,
  errorDetails,
  isUploading,
  onFileSelect,
  onCancel,
  onUpload,
  maxFileSize,
  maxFileSizeFormatted
}) => {
  if (!file) {
    return <UploadPrompt 
      onFileSelect={onFileSelect} 
      maxFileSize={maxFileSize}
      maxFileSizeFormatted={maxFileSizeFormatted}
    />;
  }

  // Handle case where there's a bucket error before showing other content
  const isBucketError = errorDetails?.message?.includes('bucket not found') || 
                       errorDetails?.message?.includes('bucket inaccessible');

  // Determine if we should show file preview based on error state
  const showFilePreview = !isBucketError || uploadStatus !== 'error';

  return (
    <div className="space-y-6">
      <UploadWarnings 
        sizeWarning={sizeWarning}
        errorDetails={errorDetails}
        uploadStatus={uploadStatus}
        onRetry={onUpload}
      />
      
      {showFilePreview && (
        <FilePreview 
          file={file}
          onRemove={onCancel}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
          error={errorDetails}
        />
      )}
      
      <UploadActions
        uploadStatus={uploadStatus}
        isUploading={isUploading}
        onCancel={onCancel}
        onUpload={onUpload}
      />
    </div>
  );
};

export default FileUploadContent;
