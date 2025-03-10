
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  BarChart4, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Package2Icon,
  ImageIcon,
  FileTextIcon,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import StatusCards from './StatusCards';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Sample data for the charts
const sampleSalesData = [
  { month: 'Jan', sales: 500 },
  { month: 'Feb', sales: 800 },
  { month: 'Mar', sales: 1200 },
  { month: 'Apr', sales: 1000 },
  { month: 'May', sales: 1500 },
  { month: 'Jun', sales: 2000 },
];

const sampleTrafficData = [
  { day: 'Mon', visits: 120 },
  { day: 'Tue', visits: 150 },
  { day: 'Wed', visits: 180 },
  { day: 'Thu', visits: 190 },
  { day: 'Fri', visits: 220 },
  { day: 'Sat', visits: 250 },
  { day: 'Sun', visits: 200 },
];

const COLORS = ['#FF00FF', '#B026FF', '#8C1ECC', '#D580FF'];

const fetchDashboardStats = async () => {
  try {
    // Use the secure function to get dashboard stats
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

const fetchRecentHireRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recent hire requests:', error);
    throw error;
  }
};

const fetchProductDistribution = async () => {
  try {
    // Since we can't use GROUP BY in this context, we'll provide categories and count each
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    
    // If no product data yet, return sample data
    if (!productsData || productsData.length === 0) {
      return [
        { name: 'Lightroom Presets', value: 55 },
        { name: 'Photo Editing Course', value: 25 },
        { name: 'Video Pack', value: 20 },
      ];
    }
    
    // Process products to count by category
    const categoryCount: Record<string, number> = {};
    productsData.forEach(product => {
      const category = product.category || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    // Transform data for chart
    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Error fetching product distribution:', error);
    // Return sample data as fallback
    return [
      { name: 'Lightroom Presets', value: 55 },
      { name: 'Photo Editing Course', value: 25 },
      { name: 'Video Pack', value: 20 },
    ];
  }
};

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchOnWindowFocus: true
  });
  
  // Fetch recent hire requests
  const {
    data: recentHireRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['recent-hire-requests'],
    queryFn: fetchRecentHireRequests,
    refetchOnWindowFocus: true
  });
  
  // Fetch product distribution data
  const {
    data: productData = [
      { name: 'Lightroom Presets', value: 55 },
      { name: 'Photo Editing Course', value: 25 },
      { name: 'Video Pack', value: 20 },
    ],
    isLoading: productDataLoading,
    refetch: refetchProductData
  } = useQuery({
    queryKey: ['product-distribution'],
    queryFn: fetchProductDistribution,
    refetchOnWindowFocus: true
  });
  
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
  
  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'Add Product':
        navigate('/admin?tab=products');
        break;
      case 'Add Media':
        navigate('/admin?tab=media');
        break;
      case 'Update Content':
        navigate('/admin?tab=content');
        break;
      case 'Process Orders':
        navigate('/admin?tab=orders');
        break;
      case 'View Analytics':
        toast({
          title: 'Analytics',
          description: 'Advanced analytics will be available in a future update',
        });
        break;
      default:
        toast({
          title: 'Action triggered',
          description: `${action} action has been triggered`,
        });
    }
  };
  
  // Display any errors if they occur
  if (statsError) {
    return (
      <div className="space-y-6">
        <Card className="bg-elvis-medium border-none">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <div className="text-red-500 mb-2 text-lg font-medium">Failed to load dashboard data</div>
              <div className="text-sm text-white/70 max-w-md mx-auto mb-4">
                {statsError.message || 'Unknown error occurred'}
              </div>
              
              <Button 
                onClick={handleRefreshData}
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
        <Card className="lg:col-span-2 bg-elvis-medium border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sampleSalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  className="animate-fade-in"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" tick={{ fill: '#fff' }} />
                  <YAxis tick={{ fill: '#fff' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: 'none', 
                      color: '#fff',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#FF00FF" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-elvis-medium border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Product Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={300}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: 'none', 
                      color: '#fff',
                      borderRadius: '0.5rem'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-elvis-medium border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Hire Requests</CardTitle>
            <CardDescription>Latest client inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-elvis-pink" />
              </div>
            ) : requestsError ? (
              <div className="text-center py-8 text-white/70">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                <p>Failed to load recent hire requests</p>
              </div>
            ) : recentHireRequests.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No hire requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentHireRequests.map((request) => (
                  <div key={request.id} className="flex items-start justify-between p-4 rounded-lg bg-elvis-light/30">
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-white/70">
                        {request.project_type.charAt(0).toUpperCase() + request.project_type.slice(1)} 
                        {request.company ? ` - ${request.company}` : ''}
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge 
                      className={
                        request.status === 'new' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : request.status === 'contacted' 
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : request.status === 'in_progress'
                          ? 'bg-purple-500/10 text-purple-500'
                          : request.status === 'completed'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }
                    >
                      {formatStatus(request.status)}
                    </Badge>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/admin?tab=hire-requests')}
                  className="w-full mt-2 border-dashed border-white/20 hover:bg-elvis-pink/20 hover:border-elvis-pink"
                >
                  View All Hire Requests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-elvis-medium border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
                onClick={() => handleQuickAction('Add Product')}
              >
                <Package2Icon className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
                onClick={() => handleQuickAction('Add Media')}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Add Media
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
                onClick={() => handleQuickAction('Update Content')}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Update Content
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
                onClick={() => handleQuickAction('Process Orders')}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Process Orders
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300 col-span-2"
                onClick={() => handleQuickAction('View Analytics')}
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                View Full Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-elvis-medium border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Traffic Overview</CardTitle>
          <CardDescription>Daily visitor statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sampleTrafficData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                className="animate-fade-in"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: 'none', 
                    color: '#fff',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#B026FF" 
                  strokeWidth={2}
                  dot={{ stroke: '#FF00FF', strokeWidth: 2, fill: '#FF00FF' }}
                  activeDot={{ r: 8 }}
                  animationDuration={1500} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
