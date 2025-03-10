
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchDashboardStats = async () => {
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

export const fetchProductDistribution = async () => {
  try {
    // Since we can't use GROUP BY with the category in this context (based on SQL error logs),
    // we'll fetch all products and do the grouping in JavaScript
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
    const categoryCount = {};
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

// Generate sample sales data based on month
export const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(0, currentMonth + 1).map(month => ({
    month,
    sales: Math.floor(Math.random() * 2000) + 500
  }));
};

export const fetchSalesData = async () => {
  try {
    // In a real app, you'd fetch from the database here
    // For now, generate sample data
    return generateSalesData();
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useRecentHireRequests = () => {
  return useQuery({
    queryKey: ['recent-hire-requests'],
    queryFn: fetchRecentHireRequests,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useProductDistribution = () => {
  return useQuery({
    queryKey: ['product-distribution'],
    queryFn: fetchProductDistribution,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useSalesData = () => {
  return useQuery({
    queryKey: ['sales-data'],
    queryFn: fetchSalesData,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
};
