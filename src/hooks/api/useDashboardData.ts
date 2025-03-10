
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Fetch dashboard stats from Supabase using RPC function
export const fetchDashboardStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Fetch recent hire requests
export const fetchRecentHireRequests = async () => {
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

// Fetch product distribution data by category
export const fetchProductDistribution = async (): Promise<Array<{ name: string; value: number }>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category, id');
    
    if (error) throw error;
    
    // If no products yet, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group products by category and count
    const categoryCount: Record<string, number> = {};
    data.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    // Transform data for chart display
    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Error fetching product distribution:', error);
    throw error;
  }
};

// Fetch monthly sales data from orders table
export const fetchSalesData = async () => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    if (!orders || orders.length === 0) {
      return [];
    }
    
    // Group by month and aggregate
    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      const year = date.getFullYear();
      const key = `${monthName} ${year}`;
      
      monthlyData[key] = (monthlyData[key] || 0) + Number(order.total_amount);
    });
    
    // Convert to array format for chart
    return Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales
    }));
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

// Fetch site traffic data (placeholder - would integrate with analytics API)
export const fetchTrafficData = async () => {
  try {
    // In a real app, you would fetch this from an analytics service
    // This is a placeholder until you integrate with a proper analytics service
    return [
      { day: 'Monday', visits: Math.floor(Math.random() * 100) + 50 },
      { day: 'Tuesday', visits: Math.floor(Math.random() * 120) + 60 },
      { day: 'Wednesday', visits: Math.floor(Math.random() * 150) + 80 },
      { day: 'Thursday', visits: Math.floor(Math.random() * 130) + 70 },
      { day: 'Friday', visits: Math.floor(Math.random() * 180) + 90 },
      { day: 'Saturday', visits: Math.floor(Math.random() * 200) + 100 },
      { day: 'Sunday', visits: Math.floor(Math.random() * 160) + 70 },
    ];
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    throw error;
  }
};

// React Query hooks for fetching dashboard data
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });
};

export const useRecentHireRequests = () => {
  return useQuery({
    queryKey: ['recent-hire-requests'],
    queryFn: fetchRecentHireRequests,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });
};

export const useProductDistribution = () => {
  return useQuery({
    queryKey: ['product-distribution'],
    queryFn: fetchProductDistribution,
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};

export const useSalesData = () => {
  return useQuery({
    queryKey: ['sales-data'],
    queryFn: fetchSalesData,
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};

export const useTrafficData = () => {
  return useQuery({
    queryKey: ['traffic-data'],
    queryFn: fetchTrafficData,
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};
