
import React from 'react';
import { useUpdateHireRequest } from '@/hooks/api/useHireRequests';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

interface UseRequestStatusUpdaterProps {
  refetch: () => void;
}

type ErrorWithCode = Error & { code?: string; statusCode?: number; details?: string };

export const useRequestStatusUpdater = ({ refetch }: UseRequestStatusUpdaterProps) => {
  const { toast } = useToast();
  
  const updateHireRequest = useUpdateHireRequest({
    onSuccess: (data) => {
      toast({
        title: 'Status updated',
        description: `Request status has been updated to "${data.status}" successfully`,
      });
      refetch();
    },
    onError: (err: ErrorWithCode) => {
      console.error('Error in updateHireRequest:', err);
      
      // Create a more detailed error message
      const errorCode = err.code || err.statusCode || 'unknown';
      const errorDetails = err.details || '';
      
      toast({
        title: 'Error updating status',
        description: (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>{err.message || 'An unexpected error occurred'}</span>
            </div>
            {errorCode !== 'unknown' && (
              <div className="text-xs text-muted-foreground mt-1">
                Error code: {errorCode}
              </div>
            )}
            {errorDetails && (
              <div className="text-xs text-muted-foreground mt-1">
                {errorDetails}
              </div>
            )}
          </div>
        ),
        variant: 'destructive',
      });
    }
  });

  const updateHireRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      console.log(`Updating request ${requestId} to status: ${newStatus}`);
      
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      
      if (!newStatus) {
        throw new Error('New status is required');
      }
      
      // Validate status values
      const validStatuses = ['new', 'contacted', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      await updateHireRequest.mutateAsync({ 
        id: requestId, 
        updates: { status: newStatus } 
      });
      
    } catch (error) {
      console.error("Error updating hire request:", error);
      
      // Determine the error type and provide specific guidance
      let errorMessage = 'Unknown error occurred';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for specific error patterns
        if (error.message.includes('network')) {
          errorDetails = 'Please check your internet connection and try again.';
        } else if (error.message.includes('permission') || error.message.includes('access')) {
          errorDetails = 'You may not have permission to update this request. Please contact an administrator.';
        } else if (error.message.includes('not found')) {
          errorDetails = 'The request could not be found. It may have been deleted.';
        }
      }
      
      toast({
        title: 'Error updating status',
        description: (
          <div className="flex flex-col gap-1">
            <span>{errorMessage}</span>
            {errorDetails && (
              <span className="text-sm opacity-80 mt-1">{errorDetails}</span>
            )}
          </div>
        ),
        variant: 'destructive',
      });
    }
  };

  return updateHireRequestStatus;
};
