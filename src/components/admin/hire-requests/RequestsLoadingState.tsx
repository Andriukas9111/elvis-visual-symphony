
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
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
    const isPermissionDenied = error.message?.includes('permission denied');
    
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
        <div className="text-red-500 mb-2 text-lg font-medium">Failed to load requests</div>
        <div className="text-sm text-white/70 max-w-md mx-auto mb-4">
          {error.message || 'Unknown error occurred'}
        </div>
        
        {isPermissionDenied && (
          <div className="mt-2 p-3 bg-red-900/20 rounded-md text-white text-sm max-w-md mb-4">
            <p className="font-medium mb-1">Permission Denied Error</p>
            <p>
              Your user account doesn't have permission to access the hire_requests table. 
              Check if your user has proper admin role and that RLS policies are configured correctly.
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => refetch()}
          className="mt-2 bg-elvis-pink hover:bg-elvis-pink/80"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RequestsLoadingState;
