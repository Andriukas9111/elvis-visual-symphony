
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
  ArrowUpRight, 
  BarChart4, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Download, 
  ShoppingCart, 
  Users,
  Package2Icon,
  ImageIcon,
  FileTextIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import ActivityFeed from './ActivityFeed';
import StatusCards from './StatusCards';

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

const sampleProductData = [
  { name: 'Lightroom Presets', value: 55 },
  { name: 'Photo Editing Course', value: 25 },
  { name: 'Video Pack', value: 20 },
];

const COLORS = ['#FF00FF', '#B026FF', '#8C1ECC', '#D580FF'];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Use profiles table instead of auth.users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*');
          
        if (ordersError) throw ordersError;
        
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        const { data: pendingRequests, error: requestsError } = await supabase
          .from('hire_requests')
          .select('*')
          .eq('status', 'new');
          
        if (requestsError) throw requestsError;
        
        setStats({
          totalUsers: usersCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue: totalRevenue,
          pendingRequests: pendingRequests?.length || 0
        });
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message);
        toast({
          title: 'Error loading dashboard data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });
  
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setAnimatedStats(prev => ({
          totalUsers: prev.totalUsers < stats.totalUsers ? prev.totalUsers + 1 : stats.totalUsers,
          totalOrders: prev.totalOrders < stats.totalOrders ? prev.totalOrders + 1 : stats.totalOrders,
          totalRevenue: prev.totalRevenue < stats.totalRevenue ? prev.totalRevenue + 10 : stats.totalRevenue,
          pendingRequests: prev.pendingRequests < stats.pendingRequests ? prev.pendingRequests + 1 : stats.pendingRequests
        }));
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, stats]);
  
  const handleQuickAction = (action: string) => {
    toast({
      title: 'Action triggered',
      description: `${action} action has been triggered`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards stats={animatedStats} />
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
            <CardTitle className="text-lg font-medium">Product Sales</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleProductData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={300}
                  >
                    {sampleProductData.map((entry, index) => (
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
            <CardTitle className="text-lg font-medium">Website Traffic</CardTitle>
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
                onClick={() => handleQuickAction('New Product')}
              >
                <Package2Icon className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border border-elvis-pink hover:bg-elvis-pink/20 transition-colors duration-300"
                onClick={() => handleQuickAction('New Media')}
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
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <CardDescription>Latest site interactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeed />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
