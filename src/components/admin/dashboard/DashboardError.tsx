
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';

interface DashboardErrorProps {
  error: Error;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  // Log detailed error information to console for debugging
  React.useEffect(() => {
    if (error) {
      console.error('Dashboard error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  }, [error]);

  const isPermissionDenied = error.message?.includes('permission denied');
  const isDatabaseConnection = error.message?.includes('database') || 
                            error.message?.includes('connection') ||
                            error.message?.toLowerCase().includes('unable to connect');

  return (
    <div className="space-y-6">
      <Card className="bg-elvis-medium border-none">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <div className="text-red-500 mb-2 text-lg font-medium">Failed to load dashboard data</div>
            <div className="text-sm text-white/70 max-w-md mx-auto mb-4">
              {error.message || 'Unknown error occurred'}
            </div>
            
            {isPermissionDenied && (
              <div className="mt-2 p-3 bg-red-900/20 rounded-md text-white text-sm max-w-md mb-4">
                <p className="font-medium mb-1">Permission Denied Error</p>
                <p>
                  Your user account doesn't have permission to access the required data. 
                  This means either:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Your account doesn't have the admin role assigned</li>
                  <li>The RLS policies aren't configured correctly</li>
                  <li>The is_admin() function isn't working properly</li>
                </ul>
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
                </ul>
                <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs font-mono overflow-auto text-left max-h-32">
                  <p className="text-white/80">Error details:</p>
                  <p className="text-red-400">{error.name}: {error.message}</p>
                </div>
              </div>
            )}
            
            <Button 
              onClick={onRetry}
              className="bg-elvis-pink hover:bg-elvis-pink/80 mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-3 border-white/10"
            >
              <Database className="mr-2 h-4 w-4" />
              Reload Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardError;
