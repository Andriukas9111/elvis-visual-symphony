
import { supabase } from '@/lib/supabase';

/**
 * Checks the Supabase storage configuration for file size limits
 */
export const checkStorageLimits = async (): Promise<number | null> => {
  try {
    // Try to fetch the service's configuration if possible
    const { data, error } = await supabase.rpc('get_storage_config');
    
    if (error) {
      console.warn('Unable to fetch Supabase storage config:', error.message);
      return null;
    }
    
    if (data && data.file_size_limit) {
      // Parse the file size limit
      const sizeStr = data.file_size_limit.toString();
      let multiplier = 1;
      
      if (sizeStr.endsWith('MiB') || sizeStr.endsWith('MB')) {
        multiplier = 1024 * 1024;
      } else if (sizeStr.endsWith('KiB') || sizeStr.endsWith('KB')) {
        multiplier = 1024;
      } else if (sizeStr.endsWith('GiB') || sizeStr.endsWith('GB')) {
        multiplier = 1024 * 1024 * 1024;
      }
      
      const numericPart = parseInt(sizeStr.replace(/[^0-9]/g, ''));
      if (!isNaN(numericPart)) {
        const bytesLimit = numericPart * multiplier;
        console.log(`Supabase storage limit detected: ${numericPart}${sizeStr.replace(/[^A-Za-z]/g, '')} (${bytesLimit} bytes)`);
        return bytesLimit;
      }
    }
    
    console.log('Could not determine Supabase storage limit from configuration');
    return null;
  } catch (error) {
    console.error('Error checking Supabase storage limits:', error);
    return null;
  }
};

/**
 * Checks if a file exceeds the Supabase storage limit
 * Returns a warning message if it does, or null if it doesn't
 */
export const checkFileSizeWarning = (fileSize: number): string | null => {
  // Default Supabase limit if we can't detect it
  const defaultLimit = 50 * 1024 * 1024; // 50MB
  
  if (fileSize > defaultLimit) {
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return `This file (${fileSizeMB}MB) exceeds the typical Supabase storage limit (50MB). If uploads fail, your admin needs to increase the storage limit in supabase/config.toml.`;
  }
  
  return null;
};

/**
 * Debug function to help troubleshoot storage issues
 */
export const logStorageConfiguration = async () => {
  try {
    console.log('Checking Supabase storage configuration...');
    
    // Test a small upload to check permissions and config
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testData = new File([testFile], 'config-test.txt');
    
    const { error } = await supabase.storage
      .from('media')
      .upload('_test/config-test.txt', testData, {
        upsert: true
      });
      
    if (error) {
      console.error('Storage test upload failed:', error);
      return {
        status: 'error',
        message: error.message,
        error
      };
    }
    
    // Clean up test file
    await supabase.storage
      .from('media')
      .remove(['_test/config-test.txt']);
      
    return {
      status: 'success',
      message: 'Storage configuration appears to be working'
    };
  } catch (error) {
    console.error('Error testing storage configuration:', error);
    return {
      status: 'error',
      message: 'Could not test storage configuration',
      error
    };
  }
};
