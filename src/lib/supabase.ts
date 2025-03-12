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
      const timeout = init?.method === 'POST' ? 60000 * 5 : 60000; // 5 minutes for POST (uploads)
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Merge the abort signal
      const fetchInit = {
        ...init,
        signal: controller.signal
      };
      
      // Create the fetch promise
      const fetchPromise = fetch(input, fetchInit);
      
      // Clear timeout when fetch completes
      fetchPromise.finally(() => clearTimeout(timeoutId));
      
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
    // Try to get the configuration from the database function
    const { data, error } = await supabase.rpc('get_storage_config');
    
    if (error) {
      console.error('Error fetching storage config:', error);
      return {
        fileSizeLimit: DEFAULT_MAX_FILE_SIZE,
        fileSizeLimitFormatted: formatFileSize(DEFAULT_MAX_FILE_SIZE)
      };
    }
    
    // Parse the limit from the response - could be in format like "1048576MiB"
    let fileSizeLimit: number = DEFAULT_MAX_FILE_SIZE;
    let sizeText = data?.file_size_limit;
    
    if (sizeText) {
      // Try to parse the size text like "1048576MiB" or "50MB"
      const sizeMatch = String(sizeText).match(/^(\d+)(MB|MiB|GB|GiB)?$/i);
      
      if (sizeMatch) {
        const size = Number(sizeMatch[1]);
        const unit = (sizeMatch[2] || 'MB').toUpperCase();
        
        // Convert to bytes
        if (unit === 'MB') fileSizeLimit = size * 1024 * 1024;
        else if (unit === 'MIB') fileSizeLimit = size * 1024 * 1024;
        else if (unit === 'GB') fileSizeLimit = size * 1024 * 1024 * 1024;
        else if (unit === 'GIB') fileSizeLimit = size * 1024 * 1024 * 1024;
      }
    }
    
    // Apply a practical limit even if the database says higher
    // Supabase has a default 8MB limit on requests in the free tier
    // This can be modified in project settings, but we use 50MB as a safe default
    const practicalLimit = 50 * 1024 * 1024; // 50MB
    const effectiveLimit = Math.min(fileSizeLimit, practicalLimit);
    
    console.log(`Storage config from DB: ${sizeText}, Effective limit: ${formatFileSize(effectiveLimit)}`);
    
    return {
      fileSizeLimit: effectiveLimit,
      fileSizeLimitFormatted: formatFileSize(effectiveLimit),
      reportedLimit: sizeText,
      reportedLimitBytes: fileSizeLimit,
      practicalLimit: practicalLimit
    };
  } catch (error) {
    console.error('Failed to get storage config:', error);
    return {
      fileSizeLimit: DEFAULT_MAX_FILE_SIZE,
      fileSizeLimitFormatted: formatFileSize(DEFAULT_MAX_FILE_SIZE)
    };
  }
};

// Helper function to format file size
const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes}B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(0)}KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(0)}MB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  }
};

// Function to list available buckets for debugging
export const listAllBuckets = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error listing buckets:', error);
      return null;
    }
    
    console.log('Available buckets:', data);
    return data;
  } catch (error) {
    console.error('Error in listAllBuckets:', error);
    return null;
  }
};

// On initialization, log some diagnostic information about storage configuration
if (isDevelopment) {
  // Check buckets on startup
  listAllBuckets().then(buckets => {
    console.log(`Found ${buckets?.length || 0} storage buckets`);
  });
  
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
