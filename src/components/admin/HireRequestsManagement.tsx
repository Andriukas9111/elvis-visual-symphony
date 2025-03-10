import React, { useEffect, useState } from 'react';
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
import { RefreshCw, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const HireRequestsManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, profile } = useAuth();
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  
  // Run database connection check when component mounts
  useEffect(() => {
    if (isAdmin) {
      console.log('Admin detected, checking database connection...');
      // Just test basic connectivity on initial load
      const testConnection = async () => {
        try {
          console.log('Testing basic Supabase connection...');
          const { data, error } = await supabase.from('hire_requests').select('count(*)', { count: 'exact', head: true });
          
          if (error) {
            console.error('Initial connection test failed:', error);
            setConnectionStatus('error');
          } else {
            console.log('Initial connection test successful');
            setConnectionStatus('success');
          }
        } catch (error) {
          console.error('Exception in connection test:', error);
          setConnectionStatus('error');
        }
      };
      
      testConnection();
    }
  }, [isAdmin]);
  
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
      setDiagnosticRunning(true);
      console.log('Diagnosing hire requests issue...');
      
      toast({
        title: 'Diagnostics started',
        description: 'Running comprehensive database checks...',
      });
      
      const dbCheckResult = await checkDatabaseConnection();
      console.log('Database check result:', dbCheckResult);
      
      toast({
        title: 'Diagnostics complete',
        description: dbCheckResult 
          ? 'Database connection verified successfully'
          : 'Database check failed - see console for details',
        variant: dbCheckResult ? 'default' : 'destructive'
      });
      
      // Update connection status based on result
      setConnectionStatus(dbCheckResult ? 'success' : 'error');
      
      // Refresh current admin role status
      if (profile) {
        console.log('Current user role:', profile.role);
      }
      
      // Force a refetch to see if the issue was resolved
      refetch();
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast({
        title: 'Diagnostics failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      setConnectionStatus('error');
    } finally {
      setDiagnosticRunning(false);
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
          {connectionStatus === 'error' && (
            <div className="flex items-center text-red-500 text-sm mr-2">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Connection error
            </div>
          )}
          {connectionStatus === 'success' && (
            <div className="flex items-center text-green-500 text-sm mr-2">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Connected
            </div>
          )}
          <Button 
            onClick={handleDiagnoseIssue} 
            variant="outline" 
            size="sm"
            disabled={diagnosticRunning}
            className="flex items-center gap-1"
          >
            {diagnosticRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {diagnosticRunning ? 'Running...' : 'Diagnose'}
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
