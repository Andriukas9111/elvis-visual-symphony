
import React from 'react';
import { AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { logError } from '@/utils/errorLogger';

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
  // Log significant errors for debugging
  React.useEffect(() => {
    if (errorDetails && uploadStatus === 'error') {
      logError(errorDetails.message, {
        level: 'error',
        context: 'file-upload',
        additionalData: { details: errorDetails.details }
      });
    }
  }, [errorDetails, uploadStatus]);

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
    errorDetails.message.includes('size limit') ||
    errorDetails.message.includes('too large') ||
    errorDetails.message.includes('maximum allowed size') ||
    errorDetails.message.toLowerCase().includes('payload too large')
  );

  // Helper to extract actual server-side size limit info from error message if available
  const extractSizeLimitFromError = () => {
    if (!errorDetails?.message) return null;
    
    // Check if we can extract a size limit from the error message
    const sizeMatch = errorDetails.message.match(/maximum size (?:of|is) ([0-9.]+)(MB|GB|MiB|GiB)/i);
    if (sizeMatch) {
      return `${sizeMatch[1]}${sizeMatch[2]}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {sizeWarning && (
        <Alert variant="warning" className="bg-amber-900/30 border-amber-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Warning</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{sizeWarning}</p>
            {sizeWarning.includes('chunked') && (
              <p className="text-xs opacity-80">
                Large files will be uploaded in smaller chunks. The process may take longer, but allows uploads beyond the usual 8MB limit.
              </p>
            )}
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
                  Despite our chunked upload system, the file upload failed. To resolve this:
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Try with a slightly smaller file first to test if chunked uploads work</li>
                  <li>Check that your file isn't corrupted</li>
                  <li>The Supabase free tier has limitations that might prevent very large uploads</li>
                  <li>Consider upgrading your Supabase plan for better upload capabilities</li>
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
