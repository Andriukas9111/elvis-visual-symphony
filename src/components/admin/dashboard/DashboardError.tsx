
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardErrorProps {
  error: Error;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
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
            
            <Button 
              onClick={onRetry}
              className="bg-elvis-pink hover:bg-elvis-pink/80"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardError;
