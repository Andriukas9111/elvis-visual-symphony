
import React, { useState, useEffect } from 'react';
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
  useProductDistribution 
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
    data: productData = [
      { name: 'Lightroom Presets', value: 55 },
      { name: 'Photo Editing Course', value: 25 },
      { name: 'Video Pack', value: 20 },
    ],
    isLoading: productDataLoading,
    refetch: refetchProductData
  } = useProductDistribution();
  
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });
  
  // Animate stats counters for visual appeal
  useEffect(() => {
    if (!statsLoading && stats) {
      const interval = setInterval(() => {
        setAnimatedStats(prev => ({
          totalUsers: prev.totalUsers < stats.total_users ? prev.totalUsers + 1 : stats.total_users,
          totalOrders: prev.totalOrders < stats.total_orders ? prev.totalOrders + 1 : stats.total_orders,
          totalRevenue: prev.totalRevenue < stats.total_revenue ? prev.totalRevenue + 10 : stats.total_revenue,
          pendingRequests: prev.pendingRequests < stats.pending_requests ? prev.pendingRequests + 1 : stats.pending_requests
        }));
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [statsLoading, stats]);
  
  const handleRefreshData = () => {
    refetchStats();
    refetchRequests();
    refetchProductData();
    
    toast({
      title: 'Data refreshed',
      description: 'Dashboard data has been refreshed',
    });
  };
  
  // Display any errors if they occur
  if (statsError) {
    return <DashboardError error={statsError} onRetry={handleRefreshData} />;
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
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards stats={statsLoading ? animatedStats : {
          totalUsers: stats?.total_users || 0,
          totalOrders: stats?.total_orders || 0,
          totalRevenue: stats?.total_revenue || 0,
          pendingRequests: stats?.pending_requests || 0
        }} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesOverviewChart />
        <ProductDistributionChart productData={productData} isLoading={productDataLoading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentHireRequests 
          recentHireRequests={recentHireRequests} 
          isLoading={requestsLoading}
          error={requestsError}
        />
        <QuickActions />
      </div>
      
      <TrafficOverviewChart />
    </div>
  );
};

export default AdminDashboard;
