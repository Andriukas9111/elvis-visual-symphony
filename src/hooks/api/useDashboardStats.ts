
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DashboardStatsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRequests: number;
}

/**
 * Hook to fetch dashboard statistics from the database
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStatsData> => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      return {
        totalUsers: data.total_users || 0,
        totalOrders: data.total_orders || 0,
        totalRevenue: data.total_revenue || 0,
        pendingRequests: data.pending_requests || 0
      };
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
