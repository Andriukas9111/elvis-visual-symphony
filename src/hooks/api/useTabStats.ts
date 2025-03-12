
import { useStats, StatItem } from '@/hooks/api/useStats';

export const useTabStats = (tabName?: string) => {
  const { data: allStats, isLoading, error } = useStats();
  
  // Filter stats by tab name if provided
  const filteredStats = tabName 
    ? allStats?.filter(stat => stat.tab === tabName || !stat.tab) || []
    : allStats || [];
  
  return {
    stats: filteredStats,
    isLoading,
    error
  };
};
