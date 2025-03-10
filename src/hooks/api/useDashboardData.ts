
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

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchOnWindowFocus: true
  });
};

export const useRecentHireRequests = () => {
  return useQuery({
    queryKey: ['recent-hire-requests'],
    queryFn: fetchRecentHireRequests,
    refetchOnWindowFocus: true
  });
};

export const useProductDistribution = () => {
  return useQuery({
    queryKey: ['product-distribution'],
    queryFn: fetchProductDistribution,
    refetchOnWindowFocus: true
  });
};
