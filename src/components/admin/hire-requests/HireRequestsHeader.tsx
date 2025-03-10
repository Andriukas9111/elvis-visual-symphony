
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ExportRequestsButton from './ExportRequestsButton';
import { Tables } from '@/types/supabase';

interface HireRequestsHeaderProps {
  requestCount: number;
  connectionStatus: 'unknown' | 'success' | 'error';
  diagnosticRunning: boolean;
  onDiagnose: () => void;
  hireRequests: Tables<'hire_requests'>[];
}

const HireRequestsHeader: React.FC<HireRequestsHeaderProps> = ({
  requestCount,
  connectionStatus,
  diagnosticRunning,
  onDiagnose,
  hireRequests
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Hire Requests {requestCount > 0 && `(${requestCount})`}</h3>
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
          onClick={onDiagnose} 
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
  );
};

export default HireRequestsHeader;
