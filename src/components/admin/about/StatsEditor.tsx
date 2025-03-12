
import React from 'react';
import { useStats } from '@/hooks/api/useStats';
import { useToast } from '@/components/ui/use-toast';
import StatsTable from './stats/StatsTable';
import NewStatForm from './stats/NewStatForm';
import { getIconByName } from './stats/IconSelector';

const StatsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: stats, isLoading } = useStats();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return <div className="p-4 text-white">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Stats Editor</h2>
        <div className="text-sm text-gray-400">
          {stats?.length || 0} Stats
        </div>
      </div>
      
      <StatsTable 
        stats={stats || []} 
        formatNumber={formatNumber}
        getIconByName={getIconByName}
      />
      
      <NewStatForm />
    </div>
  );
};

export default StatsEditor;
