
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { checkDatabaseConnection } from '@/utils/databaseCheck';

export const useDatabaseStatus = () => {
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

  return {
    connectionStatus,
    diagnosticRunning,
    handleDiagnoseIssue
  };
};
