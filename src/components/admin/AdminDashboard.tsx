
import React from 'react';
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
import { 
  useDashboardStats, 
  useRecentHireRequests, 
  useProductDistribution,
  useSalesData,
  useTrafficData
} from '@/hooks/api/useDashboardData';

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useDashboardStats();
  
  // Fetch recent hire requests
  const {
    data: recentHireRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useRecentHireRequests();
  
  // Fetch product distribution data
  const {
    data: productData = [],
    isLoading: productDataLoading,
    error: productDataError,
    refetch: refetchProductData
  } = useProductDistribution();
  
  // Fetch sales data
  const {
    data: salesData = [],
    isLoading: salesDataLoading,
    error: salesDataError,
    refetch: refetchSalesData
  } = useSalesData();
  
  // Fetch traffic data
  const {
    data: trafficData = [],
    isLoading: trafficDataLoading,
    error: trafficDataError,
    refetch: refetchTrafficData
  } = useTrafficData();
  
  const handleRefreshData = () => {
    refetchStats();
    refetchRequests();
    refetchProductData();
    refetchSalesData();
    refetchTrafficData();
    
    toast({
      title: 'Dashboard refreshed',
      description: 'All dashboard data has been updated',
    });
  };
  
  // Display any errors if they occur with dashboard stats
  if (statsError) {
    return <DashboardError error={statsError as Error} onRetry={handleRefreshData} />;
  }
  
  const defaultStats = {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRequests: 0
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button 
          onClick={handleRefreshData}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards 
          stats={stats || defaultStats}
          isLoading={statsLoading} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverviewChart 
          data={salesData} 
          isLoading={salesDataLoading}
          isError={!!salesDataError}
        />
        <ProductDistributionChart 
          productData={productData} 
          isLoading={productDataLoading}
          isError={!!productDataError}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentHireRequests 
          recentHireRequests={recentHireRequests} 
          isLoading={requestsLoading}
          isError={!!requestsError}
        />
        <QuickActions />
      </div>
      
      <TrafficOverviewChart 
        data={trafficData}
        isLoading={trafficDataLoading}
        isError={!!trafficDataError}
      />
    </div>
  );
};

export default AdminDashboard;
