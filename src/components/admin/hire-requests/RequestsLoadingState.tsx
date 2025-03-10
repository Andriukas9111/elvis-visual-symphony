
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequestsLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const RequestsLoadingState: React.FC<RequestsLoadingStateProps> = ({ 
  isLoading, 
  error, 
  refetch 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="text-red-500 mb-2">Failed to load requests</div>
        <div className="text-sm text-white/60 max-w-md mx-auto">
          {error.message || 'Unknown error occurred'}
          {error.message?.includes('permission denied') && (
            <div className="mt-2 p-2 bg-red-900/20 rounded">
              Permission denied error detected. This is likely due to a Row Level Security (RLS) issue.
              Please check database permissions for hire_requests table.
            </div>
          )}
        </div>
        <Button 
          onClick={() => refetch()}
          className="mt-4 bg-elvis-pink hover:bg-elvis-pink/80"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RequestsLoadingState;
