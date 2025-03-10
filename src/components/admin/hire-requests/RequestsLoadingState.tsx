
import React from 'react';
import { Loader2, AlertTriangle, Database } from 'lucide-react';
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
  // Log detailed error information to console for debugging
  React.useEffect(() => {
    if (error) {
      console.error('Detailed hire requests error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-elvis-pink animate-spin" />
      </div>
    );
  }
  
  if (error) {
    const isPermissionDenied = error.message?.includes('permission denied');
    const isDatabaseConnection = error.message?.includes('database') || 
                                error.message?.includes('connection') ||
                                error.message?.toLowerCase().includes('unable to connect');
    
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
              This means either:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your account doesn't have the admin role assigned</li>
              <li>The RLS policies aren't configured correctly</li>
              <li>The is_admin() function isn't working properly</li>
            </ul>
            <p className="mt-2">
              Try logging out and back in, or contact the system administrator.
            </p>
          </div>
        )}
        
        {isDatabaseConnection && (
          <div className="mt-2 p-3 bg-red-900/20 rounded-md text-white text-sm max-w-md mb-4">
            <p className="font-medium mb-1">Database Connection Error</p>
            <p>
              Unable to connect to the database. This could be due to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Network connectivity issues</li>
              <li>Database server is unavailable</li>
              <li>Supabase configuration issues</li>
              <li>RLS policy execution errors</li>
            </ul>
            <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono overflow-auto text-left max-h-32">
              <p className="text-white/80">Error details:</p>
              <p className="text-red-400">{error.name}: {error.message}</p>
              {error.stack && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-white/60">Stack trace</summary>
                  <pre className="whitespace-pre-wrap text-white/60 mt-1 text-[10px]">
                    {error.stack.split('\n').slice(1, 6).join('\n')}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => refetch()}
          className="mt-2 bg-elvis-pink hover:bg-elvis-pink/80 flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Run Database Diagnostic
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RequestsLoadingState;
