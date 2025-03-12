
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

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
  if (uploadStatus !== 'idle') {
    return null;
  }

  return (
    <div className="flex justify-end space-x-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-white/10"
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      
      <Button
        type="button"
        onClick={onUpload}
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
  );
};

export default UploadActions;
