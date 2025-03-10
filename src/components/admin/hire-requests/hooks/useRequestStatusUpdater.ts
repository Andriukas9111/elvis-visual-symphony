
import { useUpdateHireRequest } from '@/hooks/api/useHireRequests';
import { useToast } from '@/components/ui/use-toast';

interface UseRequestStatusUpdaterProps {
  refetch: () => void;
}

export const useRequestStatusUpdater = ({ refetch }: UseRequestStatusUpdaterProps) => {
  const { toast } = useToast();
  
  const updateHireRequest = useUpdateHireRequest({
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: `Request status has been updated successfully`,
      });
      refetch();
    },
    onError: (err) => {
      console.error('Error in updateHireRequest:', err);
      toast({
        title: 'Error updating status',
        description: err.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  });

  const updateHireRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      console.log(`Updating request ${requestId} to status: ${newStatus}`);
      
      await updateHireRequest.mutateAsync({ 
        id: requestId, 
        updates: { status: newStatus } 
      });
      
    } catch (error) {
      console.error("Error updating hire request:", error);
      toast({
        title: 'Error updating status',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  return updateHireRequestStatus;
};
