
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ errorMessage, onRetry }) => {
  return (
    <Card className="border-red-500/30 border-2 bg-elvis-medium">
      <CardHeader>
        <CardTitle className="flex items-center text-red-400 gap-2">
          <AlertTriangle />
          Dashboard Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-500/10 p-4 rounded-md">
          <h3 className="font-medium text-red-400 mb-2">
            Failed to load dashboard data
          </h3>
          <p className="text-sm text-white/70 mb-4">
            There was an error connecting to your database. This may be due to:
          </p>
          <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Network connection issues</li>
            <li>Database configuration problems</li>
            <li>Permission/authorization errors</li>
            <li>Supabase service disruption</li>
          </ul>
          {errorMessage && (
            <div className="mt-4 p-3 bg-elvis-light/20 rounded text-xs overflow-auto max-h-40">
              <p className="font-mono text-red-300">{errorMessage}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-white/70">
            Try refreshing the dashboard data
          </p>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="flex items-center gap-2 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardError;
