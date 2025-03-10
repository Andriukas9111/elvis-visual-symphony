
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

/**
 * Utility function to check database connectivity and diagnose issues
 */
export const checkDatabaseConnection = async () => {
  console.log('Running database connection check...');
  
  try {
    // Test basic connectivity
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
      
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
    
    // Get the current user directly to avoid profile table RLS issues
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting current user:', userError);
      return false;
    }
    
    if (!userData || !userData.user) {
      console.error('No authenticated user found');
      toast({
        title: 'Authentication Error',
        description: 'You need to be logged in to perform this check',
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Current user:', userData.user.email);
    
    // First check if user has a profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userData.user.id)
      .single();
    
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
      
      // Ask if the user wants to set their role to admin
      toast({
        title: 'Fix Admin Role?',
        description: 'Would you like to set your role to admin? You can do this directly in SQL or via the Supabase dashboard.',
        variant: 'default',
      });
      
      return false;
    }
    
    toast({
      title: 'Profile Check Passed',
      description: `Your role is: ${userProfile.role}`,
    });
    
    // Now check the get_admin_status function
    console.log('Checking admin status using get_admin_status function...');
    const { data: isAdmin, error: adminStatusError } = await supabase.rpc('get_admin_status');
    
    if (adminStatusError) {
      console.error('Error checking admin status:', adminStatusError);
      console.error('Error details:', JSON.stringify(adminStatusError));
      
      toast({
        title: 'Admin Status Check Failed',
        description: `Error: ${adminStatusError.message}. The security definer function might not be working correctly.`,
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Admin status check result:', isAdmin);
    
    if (!isAdmin) {
      console.error('Security definer function says user is not admin, but profile has admin role!');
      toast({
        title: 'Admin Status Mismatch',
        description: 'The get_admin_status function says you are not an admin, but your profile has the admin role. This indicates a problem with the function.',
        variant: 'destructive',
      });
      return false;
    }
    
    // Test hire_requests access directly
    console.log('Testing hire_requests access...');
    const { data: hireRequestsTest, error: hireRequestsError } = await supabase
      .from('hire_requests')
      .select('count(*)', { count: 'exact', head: true });
      
    if (hireRequestsError) {
      console.error('Error testing hire_requests access:', hireRequestsError);
      console.error('Error details:', JSON.stringify(hireRequestsError));
      
      toast({
        title: 'Hire Requests Access Error',
        description: `Unable to access hire requests: ${hireRequestsError.message}`,
        variant: 'destructive',
      });
      
      // Try different approach to isolate the issue
      console.log('Trying direct fetch of first request for diagnostics...');
      const { error: directFetchError } = await supabase
        .from('hire_requests')
        .select('id')
        .limit(1);
        
      if (directFetchError) {
        console.error('Alternative access also failed:', directFetchError);
        console.error('Error details:', JSON.stringify(directFetchError));
        
        if (directFetchError.message.includes('permission denied')) {
          toast({
            title: 'RLS Policy Issue Detected',
            description: 'The Row Level Security policy for hire_requests is not correctly applying the admin privileges',
            variant: 'destructive',
          });
        }
      }
      
      return false;
    }
    
    console.log('Hire requests access successful:', hireRequestsTest);
    toast({
      title: 'Access Check Passed',
      description: 'Successfully connected to hire_requests table',
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error during database check:', error);
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
}
