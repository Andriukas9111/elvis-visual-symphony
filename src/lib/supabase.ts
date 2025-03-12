import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use environment variables where possible, but keep the existing values as fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxlaikphdjcjjtyxfvpz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGFpa3BoZGpjamp0eXhmdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDg4MTgsImV4cCI6MjA1NzAyNDgxOH0.CBwaRYwvcwIizUmZG2ExY7Q1OPtMSwy1xFFBhGyqTYI';

// Check for development mode to output debug info
const isDevelopment = import.meta.env.DEV === true;

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (input, init) => {
      // For large file uploads, we need to avoid timeouts
      const fetchPromise = fetch(input, init);
      
      // Log all network errors in development
      if (isDevelopment) {
        fetchPromise.catch(error => {
          console.error('Supabase fetch error:', error);
        });
      }
      
      return fetchPromise;
    }
  }
});

// Add utility function to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Add utility function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get subscribers with pagination
export const getSubscribers = async (page = 1, pageSize = 50) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) throw error;
  return { data, count };
};

// Add a new subscriber
export const addSubscriber = async (email) => {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }])
    .select();
    
  if (error) throw error;
  return data[0];
};

// Delete a subscriber
export const deleteSubscriber = async (id) => {
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

// Get hire requests with pagination
export const getHireRequests = async (page = 1, pageSize = 50) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('hire_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
    
  if (error) throw error;
  return { data, count };
};

// Add a new hire request
export const addHireRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('hire_requests')
    .insert([requestData])
    .select();
    
  if (error) throw error;
  return data[0];
};

// Update a hire request
export const updateHireRequest = async (id, updates) => {
  const { data, error } = await supabase
    .from('hire_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Get storage configuration including file size limits
export const getStorageConfig = async () => {
  try {
    const { data, error } = await supabase.rpc('get_storage_config');
    
    if (error) {
      console.error('Error fetching storage config:', error.message);
      return null;
    }
    
    // Parse the file size limit if present
    if (data && data.file_size_limit) {
      const sizeStr = data.file_size_limit.toString();
      let multiplier = 1;
      let limit = 0;
      
      if (sizeStr.endsWith('MiB') || sizeStr.endsWith('MB')) {
        multiplier = 1024 * 1024;
      } else if (sizeStr.endsWith('KiB') || sizeStr.endsWith('KB')) {
        multiplier = 1024;
      } else if (sizeStr.endsWith('GiB') || sizeStr.endsWith('GB')) {
        multiplier = 1024 * 1024 * 1024;
      }
      
      const numericPart = parseInt(sizeStr.replace(/[^0-9]/g, ''));
      if (!isNaN(numericPart)) {
        limit = numericPart * multiplier;
      }
      
      return {
        fileSizeLimit: limit,
        fileSizeLimitFormatted: sizeStr,
        rawConfig: data
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking storage config:', error);
    return null;
  }
};

// On initialization, log some diagnostic information about storage configuration
if (isDevelopment) {
  // Import dynamically to avoid circular dependencies
  import('@/utils/checkSupabaseConfig').then(({ logStorageConfiguration }) => {
    logStorageConfiguration().then(result => {
      console.log('Storage configuration check:', result);
    });
    
    // Check and log storage limits
    getStorageConfig().then(config => {
      if (config) {
        console.log(`Storage file size limit: ${config.fileSizeLimitFormatted} (${config.fileSizeLimit} bytes)`);
      } else {
        console.log('Could not detect storage file size limit - using default of 50MB');
      }
    });
  });
}
