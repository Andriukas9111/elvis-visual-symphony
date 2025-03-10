
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHireRequests, useUpdateHireRequest } from '@/hooks/api/useHireRequests';
import { useToast } from '@/components/ui/use-toast';
import AdminAccessRequired from './hire-requests/AdminAccessRequired';
import RequestsLoadingState from './hire-requests/RequestsLoadingState';
import EmptyRequestsState from './hire-requests/EmptyRequestsState';
import HireRequestsTable from './hire-requests/HireRequestsTable';
import ExportRequestsButton from './hire-requests/ExportRequestsButton';
import { checkDatabaseConnection } from '@/utils/databaseCheck';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const HireRequestsManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  // Run database connection check when component mounts
  useEffect(() => {
    if (isAdmin) {
      console.log('Admin detected, checking database connection...');
      checkDatabaseConnection().catch(err => {
        console.error('Database check failed:', err);
      });
    }
  }, [isAdmin]);
  
  const { 
    data: hireRequests = [], 
    isLoading, 
    error,
    refetch,
    isError
  } = useHireRequests({
    queryKey: ['hire_requests'],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
    meta: {
      onError: (err: Error) => {
        console.error('Error in useHireRequests hook:', err);
        toast({
          title: 'Error loading hire requests',
          description: err.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    }
  });
  
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

  const handleDiagnoseIssue = async () => {
    try {
      console.log('Diagnosing hire requests issue...');
      const dbCheckResult = await checkDatabaseConnection();
      console.log('Database check result:', dbCheckResult);
      
      toast({
        title: 'Diagnostics complete',
        description: 'Check console for detailed information',
      });
      
      // Force a refetch
      refetch();
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast({
        title: 'Diagnostics failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
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
        <h3 className="text-lg font-medium">Hire Requests {!isLoading && !isError && `(${hireRequests.length})`}</h3>
        <div className="flex gap-2">
          <Button 
            onClick={handleDiagnoseIssue} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Diagnose
          </Button>
          {hireRequests.length > 0 && <ExportRequestsButton hireRequests={hireRequests} />}
        </div>
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
