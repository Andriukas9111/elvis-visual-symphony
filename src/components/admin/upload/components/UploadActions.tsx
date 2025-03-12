
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

interface UploadActionsProps {
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  isUploading: boolean;
  onCancel: () => void;
  onUpload: () => void;
}

const UploadActions: React.FC<UploadActionsProps> = ({
  uploadStatus,
  isUploading,
  onCancel,
  onUpload
}) => {
  return (
    <div className="flex items-center justify-end space-x-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isUploading}
        className="border-white/10 hover:bg-white/5"
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      
      {uploadStatus !== 'success' && (
        <Button
          type="button"
          onClick={onUpload}
          disabled={isUploading}
          className="bg-elvis-pink hover:bg-elvis-pink-dark"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
      )}
      
      {uploadStatus === 'success' && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-green-500 text-green-400 hover:bg-green-500/10"
        >
          Upload Another File
        </Button>
      )}
    </div>
  );
};

export default UploadActions;
