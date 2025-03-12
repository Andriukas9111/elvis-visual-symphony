
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UploadWarningsProps {
  sizeWarning: string | null;
  errorDetails: { message: string; details?: string } | null;  // Changed from string to object
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  actualStorageLimit: number | null;
}

const UploadWarnings: React.FC<UploadWarningsProps> = ({
  sizeWarning,
  errorDetails,
  uploadStatus,
  actualStorageLimit
}) => {
  return (
    <div className="space-y-4">
      {sizeWarning && (
        <Alert variant="warning" className="bg-amber-900/30 border-amber-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Warning</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{sizeWarning}</p>
            <p className="text-xs opacity-80">To fix this issue, edit the file_size_limit in supabase/config.toml.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {errorDetails && uploadStatus === 'error' && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{errorDetails.message}</p>
            {errorDetails.details && (
              <p className="text-sm opacity-80 whitespace-pre-line">
                {errorDetails.details}
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {actualStorageLimit && (
        <Alert className="bg-blue-900/20 border-blue-700/50">
          <Info className="h-4 w-4" />
          <AlertTitle>Current Server Limits</AlertTitle>
          <AlertDescription>
            Maximum file size: {(actualStorageLimit / (1024 * 1024)).toFixed(0)}MB
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadWarnings;
