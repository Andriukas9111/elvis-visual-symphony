
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UploadErrorProps {
  error: string;
  details?: string;
}

const UploadError: React.FC<UploadErrorProps> = ({ error, details }) => {
  return (
    <Alert variant="destructive" className="bg-red-900/30 border-red-700">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Upload Failed</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        {details && (
          <p className="text-sm opacity-80 whitespace-pre-line">
            {details}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UploadError;
