
import React from 'react';
import { AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface UploadWarningsProps {
  sizeWarning: string | null;
  errorDetails: { message: string; details?: string } | null;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  onRetry?: () => void;
}

const UploadWarnings: React.FC<UploadWarningsProps> = ({
  sizeWarning,
  errorDetails,
  uploadStatus,
  onRetry
}) => {
  // Helper function to check for bucket errors
  const isBucketError = errorDetails?.message && (
    errorDetails.message.includes('bucket not found') ||
    errorDetails.message.includes('bucket inaccessible') ||
    errorDetails.message.includes('not accessible')
  );

  // Helper function to check for size errors
  const isSizeError = errorDetails?.message && (
    errorDetails.message.includes('exceeds') ||
    errorDetails.message.includes('file too large') ||
    errorDetails.message.includes('size limit')
  );

  return (
    <div className="space-y-4">
      {sizeWarning && (
        <Alert variant="warning" className="bg-amber-900/30 border-amber-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Warning</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{sizeWarning}</p>
            <p className="text-xs opacity-80">
              The current file size limit is configured in your Supabase storage bucket settings.
              You can increase this limit in supabase/config.toml and by running migrations.
            </p>
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
            
            {isSizeError && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">
                  The file is too large for your current storage settings. To resolve this:
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Update the file_size_limit in supabase/config.toml (currently 1000MiB)</li>
                  <li>Run the migration scripts to update your Supabase bucket configuration</li>
                  <li>Try with a smaller file until the settings are updated</li>
                </ul>
              </div>
            )}
            
            {isBucketError && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">
                  The storage bucket isn't accessible. Please try these solutions:
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Refresh the page and try again (bucket creation may take a moment to propagate)</li>
                  <li>Check that the 'media' bucket exists in your Supabase dashboard</li>
                  <li>Verify that storage permissions are properly configured</li>
                </ul>
                {onRetry && (
                  <Button 
                    onClick={onRetry} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-red-500/50 hover:bg-red-800/20"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry Upload
                  </Button>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadWarnings;
