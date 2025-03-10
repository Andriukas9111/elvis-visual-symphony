
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

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Function to simulate data refresh
  const handleRefreshData = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success message
      toast({
        title: 'Dashboard refreshed',
        description: 'All dashboard data has been updated',
      });
    }, 1500);
  };
  
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
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverviewChart isLoading={isLoading} />
        <ProductDistributionChart isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentHireRequests isLoading={isLoading} />
        <QuickActions />
      </div>
      
      <TrafficOverviewChart isLoading={isLoading} />
    </div>
  );
};

export default AdminDashboard;
