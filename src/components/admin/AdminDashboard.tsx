
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';
import StatusCards from './StatusCards';
import SalesOverviewChart from './dashboard/SalesOverviewChart';
import ProductDistributionChart from './dashboard/ProductDistributionChart';
import RecentHireRequests from './dashboard/RecentHireRequests';
import QuickActions from './dashboard/QuickActions';
import TrafficOverviewChart from './dashboard/TrafficOverviewChart';
import DashboardError from './dashboard/DashboardError';
import { useDashboardStats } from '@/hooks/api/useDashboardStats';
import { useHireRequests } from '@/hooks/api/useHireRequests';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch real statistics from the database
  const { 
    data: statsData, 
    isLoading: isStatsLoading, 
    isError: hasStatsError, 
    error: statsError,
    refetch: refetchStats
  } = useDashboardStats();
  
  // Fetch real hire requests
  const {
    data: hireRequestsData,
    isLoading: isHireRequestsLoading,
    isError: hasHireRequestsError,
    refetch: refetchHireRequests
  } = useHireRequests({ pageSize: 4 });
  
  // Function to refresh all dashboard data
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    try {
      await Promise.all([
        refetchStats(),
        refetchHireRequests()
      ]);
      
      // Show success message
      toast({
        title: 'Dashboard refreshed',
        description: 'All dashboard data has been updated',
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: 'Refresh failed',
        description: 'Could not update dashboard data',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Determine if there's an error to show
  const hasError = hasStatsError || hasHireRequestsError;
  const errorMessage = statsError instanceof Error ? statsError.message : 'Failed to load dashboard data';
  
  // If there's an error, show the error component
  if (hasError) {
    return <DashboardError errorMessage={errorMessage} onRetry={handleRefreshData} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button 
          onClick={handleRefreshData}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards 
          stats={statsData} 
          isLoading={isStatsLoading || isRefreshing} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverviewChart isLoading={isStatsLoading || isRefreshing} />
        <ProductDistributionChart isLoading={isStatsLoading || isRefreshing} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentHireRequests 
          hireRequests={hireRequestsData} 
          isLoading={isHireRequestsLoading || isRefreshing} 
          isError={hasHireRequestsError} 
        />
        <QuickActions />
      </div>
      
      <TrafficOverviewChart isLoading={isStatsLoading || isRefreshing} />
    </div>
  );
};

export default AdminDashboard;
