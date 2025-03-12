
import React from 'react';
import UploadPrompt from './UploadPrompt';
import FilePreview from './FilePreview';
import ThumbnailGenerator from './ThumbnailGenerator';
import UploadWarnings from './UploadWarnings';
import UploadActions from './UploadActions';

interface FileUploadContentProps {
  file: File | null;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  sizeWarning: string | null;
  errorDetails: { message: string; details?: string } | null;
  actualStorageLimit: number | null;
  isUploading: boolean;
  uploadedVideoId: string | null;
  uploadedVideoUrl: string | null;
  selectedThumbnail: string | null;
  onFileSelect: () => void;
  onCancel: () => void;
  onUpload: () => void;
  onThumbnailSelected: (thumbnailUrl: string) => void;
  maxFileSize: number;
}

const FileUploadContent: React.FC<FileUploadContentProps> = ({
  file,
  uploadProgress,
  uploadStatus,
  sizeWarning,
  errorDetails,
  actualStorageLimit,
  isUploading,
  uploadedVideoId,
  uploadedVideoUrl,
  selectedThumbnail,
  onFileSelect,
  onCancel,
  onUpload,
  onThumbnailSelected,
  maxFileSize
}) => {
  if (!file) {
    return <UploadPrompt onFileSelect={onFileSelect} maxFileSize={maxFileSize} />;
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
        actualStorageLimit={actualStorageLimit}
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
      
      {file.type.startsWith('video/') && uploadStatus === 'idle' && !isBucketError && (
        <ThumbnailGenerator
          videoFile={file}
          onThumbnailSelected={onThumbnailSelected}
        />
      )}
      
      {uploadStatus === 'success' && file.type.startsWith('video/') && uploadedVideoId && uploadedVideoUrl && (
        <ThumbnailGenerator
          videoFile={null}
          videoId={uploadedVideoId}
          videoUrl={uploadedVideoUrl}
          onThumbnailSelected={onThumbnailSelected}
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
