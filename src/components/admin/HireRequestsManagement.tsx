
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHireRequests, useUpdateHireRequest } from '@/hooks/api/useHireRequests';
import { useToast } from '@/components/ui/use-toast';
import AdminAccessRequired from './hire-requests/AdminAccessRequired';
import RequestsLoadingState from './hire-requests/RequestsLoadingState';
import EmptyRequestsState from './hire-requests/EmptyRequestsState';
import HireRequestsTable from './hire-requests/HireRequestsTable';
import ExportRequestsButton from './hire-requests/ExportRequestsButton';

const HireRequestsManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const { 
    data: hireRequests = [], 
    isLoading, 
    error,
    refetch
  } = useHireRequests({
    queryKey: ['hire_requests'],
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
  
  const updateHireRequest = useUpdateHireRequest({
    onSuccess: () => {
      toast({
        title: 'Status updated',
        description: `Request status has been updated successfully`,
      });
      refetch();
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
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  if (!isAdmin) {
    return <AdminAccessRequired />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Hire Requests ({hireRequests.length})</h3>
        {hireRequests.length > 0 && <ExportRequestsButton hireRequests={hireRequests} />}
      </div>
      
      <RequestsLoadingState isLoading={isLoading} error={error} refetch={refetch} />
      
      {!isLoading && !error && (
        hireRequests.length === 0 
          ? <EmptyRequestsState />
          : <HireRequestsTable 
              hireRequests={hireRequests} 
              updateHireRequestStatus={updateHireRequestStatus} 
            />
      )}
    </div>
  );
};

export default HireRequestsManagement;
