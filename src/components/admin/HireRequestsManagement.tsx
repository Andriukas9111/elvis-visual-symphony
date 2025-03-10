
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHireRequests } from '@/hooks/api/useHireRequests';
import AdminAccessRequired from './hire-requests/AdminAccessRequired';
import RequestsLoadingState from './hire-requests/RequestsLoadingState';
import EmptyRequestsState from './hire-requests/EmptyRequestsState';
import HireRequestsTable from './hire-requests/HireRequestsTable';
import HireRequestsHeader from './hire-requests/HireRequestsHeader';
import { useDatabaseStatus } from './hire-requests/hooks/useDatabaseStatus';
import { useRequestStatusUpdater } from './hire-requests/hooks/useRequestStatusUpdater';

const HireRequestsManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const { connectionStatus, diagnosticRunning, handleDiagnoseIssue } = useDatabaseStatus();
  
  // Fetch hire requests data
  const { 
    data: hireRequests = [], 
    isLoading, 
    error,
    refetch,
    isError
  } = useHireRequests({
    pageSize: 10,
    page: 1
  });
  
  // Handle request status updates
  const updateHireRequestStatus = useRequestStatusUpdater({ refetch });

  if (!isAdmin) {
    return <AdminAccessRequired />;
  }
  
  return (
    <div className="space-y-4">
      <HireRequestsHeader 
        requestCount={!isLoading && !isError ? hireRequests.length : 0}
        connectionStatus={connectionStatus}
        diagnosticRunning={diagnosticRunning}
        onDiagnose={handleDiagnoseIssue}
        hireRequests={hireRequests}
      />
      
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
