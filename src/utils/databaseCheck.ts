
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import * as api from '@/lib/api';

/**
 * Utility function to check database connectivity and diagnose issues
 */
export const checkDatabaseConnection = async () => {
  console.log('Running database connection check...');
  const startTime = Date.now();
  const results: Record<string, any> = {};
  
  try {
    // Add timestamp to logs for debugging
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Database check started`);
    
    // Test Supabase client initialization
    if (!supabase) {
      console.error('Supabase client is not initialized');
      toast({
        title: 'Configuration Error',
        description: 'Supabase client is not properly initialized',
        variant: 'destructive',
      });
      return false;
    }
    
    // Test basic connectivity
    console.log('Testing basic database connectivity...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
      
    results.basicConnectivity = { success: !connectionError, error: connectionError?.message };
    
    if (connectionError) {
      console.error('Database connection error:', connectionError);
      console.error('Error details:', JSON.stringify(connectionError));
      
      toast({
        title: 'Database Connection Error',
        description: `Unable to connect to the database: ${connectionError.message}`,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Database connection successful');
    
    // Test authentication status
    console.log('Checking authentication status...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    results.authStatus = { 
      success: !authError && !!authData?.user, 
      error: authError?.message,
      isAuthenticated: !!authData?.user,
      userId: authData?.user?.id
    };
    
    if (authError) {
      console.error('Authentication error:', authError);
      toast({
        title: 'Authentication Error',
        description: `Error getting current user: ${authError.message}`,
        variant: 'destructive',
      });
      return false;
    }
    
    if (!authData.user) {
      console.error('No authenticated user found');
      toast({
        title: 'Authentication Error',
        description: 'You need to be logged in to perform this check',
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Current user:', authData.user.email);
    
    // Test the is_admin() function directly
    console.log('Testing is_admin() function...');
    const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin');
    
    results.isAdminFunction = { 
      success: !isAdminError, 
      result: isAdminResult, 
      error: isAdminError?.message 
    };
    
    console.log('is_admin() function returned:', isAdminResult);
    
    if (isAdminError) {
      console.error('Error calling is_admin() function:', isAdminError);
      toast({
        title: 'Admin Function Error',
        description: `Error when calling is_admin(): ${isAdminError.message}`,
        variant: 'destructive',
      });
      return false;
    }
    
    // Check if user has a profile
    console.log('Checking user profile...');
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', authData.user.id)
      .single();
    
    results.profileCheck = { 
      success: !profileError, 
      profile: userProfile, 
      error: profileError?.message 
    };
    
    if (profileError) {
      console.error('Profile check failed:', profileError);
      toast({
        title: 'Profile Error',
        description: `Could not fetch your profile: ${profileError.message}`,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('User profile check successful:', userProfile);
    
    // Check if the user is an admin
    if (userProfile.role !== 'admin') {
      console.error('User does not have admin role:', userProfile.role);
      toast({
        title: 'Role Issue Detected',
        description: 'Your user does not have admin role (current role: ' + (userProfile.role || 'none') + '). This is required to access hire requests.',
        variant: 'destructive',
      });
      
      // Offer to fix the role
      const shouldUpdate = confirm('Would you like to update your role to admin?');
      if (shouldUpdate) {
        const { error: roleUpdateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', authData.user.id);
          
        if (roleUpdateError) {
          console.error('Error updating role:', roleUpdateError);
          toast({
            title: 'Role Update Failed',
            description: roleUpdateError.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Role Updated',
            description: 'Your role has been set to admin. Please refresh the page.',
          });
          
          // Force a refresh
          setTimeout(() => window.location.reload(), 1500);
        }
      }
      
      return false;
    }
    
    toast({
      title: 'Profile Check Passed',
      description: `Your role is: ${userProfile.role}`,
    });
    
    // Test hire_requests access directly
    console.log('Testing direct hire_requests access...');
    
    // First try a simple SELECT to see if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('hire_requests')
      .select('id')
      .limit(1);
      
    results.hireRequestsAccess = { 
      success: !testError, 
      data: testData, 
      error: testError?.message,
      errorDetails: testError ? JSON.stringify(testError) : null
    };
    
    if (testError) {
      console.error('Basic hire_requests access failed:', testError);
      console.error('Error details:', JSON.stringify(testError));
      
      toast({
        title: 'Hire Requests Access Error',
        description: `Unable to access hire requests: ${testError.message}`,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Basic hire_requests access successful!', testData);
    
    // Then try the actual API function 
    try {
      console.log('Testing API function getHireRequests()...');
      const data = await api.getHireRequests();
      console.log('Successfully fetched hire requests via API function:', data);
      
      results.apiFunction = { success: true, count: data.length };
      
      toast({
        title: 'Access Check Passed',
        description: `Successfully connected to hire_requests table and retrieved ${data.length} requests`,
      });
      
      // Complete database check duration
      const duration = Date.now() - startTime;
      console.log(`Database check completed in ${duration}ms`);
      
      // Log the full diagnostic results
      console.log('Diagnostic results:', results);
      
      return true;
    } catch (error) {
      console.error('Error using getHireRequests API function:', error);
      
      results.apiFunction = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
      
      toast({
        title: 'API Function Error',
        description: error instanceof Error ? error.message : 'Unknown error in getHireRequests',
        variant: 'destructive',
      });
      
      // Complete database check duration
      const duration = Date.now() - startTime;
      console.log(`Database check failed after ${duration}ms`);
      
      // Log the full diagnostic results
      console.log('Diagnostic results:', results);
      
      return false;
    }
  } catch (error) {
    console.error('Unexpected error during database check:', error);
    
    results.unexpected = { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    };
    
    // Log the full diagnostic results
    console.log('Diagnostic results (after error):', results);
    
    toast({
      title: 'Database Error',
      description: 'An unexpected error occurred while checking database. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

// Export a function that can be called from browser console to diagnose admin issues
if (typeof window !== 'undefined') {
  (window as any).checkDatabaseAccess = checkDatabaseConnection;
  (window as any).testSupabaseConnection = async () => {
    try {
      // Test Supabase URL and anon key
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'Using fallback URL');
      
      // Test a simple query
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.error('Connection test failed:', error);
        return { success: false, error };
      }
      
      console.log('Connection test successful!');
      return { success: true, data };
    } catch (error) {
      console.error('Connection test exception:', error);
      return { success: false, error };
    }
  };
}
