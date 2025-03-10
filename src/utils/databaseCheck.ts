
import { supabase } from '@/lib/supabase';

/**
 * Checks if the database connection is working
 * @returns Promise that resolves if connection is successful
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a simple count from a table that should always exist
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection check failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Database connection check error:', error);
    throw error;
  }
};

/**
 * Get dashboard stats using RPC
 */
export const getDashboardStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};
