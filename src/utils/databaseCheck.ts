
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
    
    // Check if the current user has a valid profile
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user && user.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.user.id)
          .single();
          
        if (profileError) {
          console.error('User profile check failed:', profileError);
          console.error('Error details:', JSON.stringify(profileError));
          
          toast({
            title: 'Profile Error',
            description: `Could not fetch your profile: ${profileError.message}`,
            variant: 'destructive',
          });
        } else {
          console.log('User profile check successful:', userProfile);
        }
      }
    } catch (userCheckError) {
      console.error('Error checking user profile:', userCheckError);
    }
    
    // Try to diagnose potential RLS issues with profiles
    try {
      console.log('Testing profiles table access using security definer function...');
      const { data: checkResult, error: rlsTestError } = await supabase.rpc('check_profiles_access');
      
      if (rlsTestError) {
        console.error('RLS policy issue detected:', rlsTestError);
        console.error('Error details:', JSON.stringify(rlsTestError));
      } else {
        console.log('Profiles access check passed:', checkResult);
      }
      
      // Check user role from the security definer function
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role');
      if (roleError) {
        console.error('Error fetching user role via security definer function:', roleError);
      } else {
        console.log('User role via security definer function:', roleData);
      }
    } catch (rlsError) {
      console.error('Error testing RLS policy:', rlsError);
    }
    
    // Test hire_requests table access for admins
    try {
      console.log('Testing hire_requests table access...');
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role');
      
      if (roleError) {
        console.error('Error checking role before hire_requests test:', roleError);
      } else if (roleData === 'admin') {
        console.log('User has admin role, testing hire_requests access...');
        const { data: hireRequests, error: hireRequestsError } = await supabase
          .from('hire_requests')
          .select('count(*)', { count: 'exact', head: true });
          
        if (hireRequestsError) {
          console.error('Error accessing hire_requests table:', hireRequestsError);
          console.error('Error details:', JSON.stringify(hireRequestsError));
          
          if (hireRequestsError.message.includes('permission denied')) {
            console.error('RLS policy issue detected: Permission denied for hire_requests table');
            toast({
              title: 'Access Error',
              description: 'Permission denied for hire_requests table. RLS policy issue detected.',
              variant: 'destructive',
            });
          }
        } else {
          console.log('Hire requests table access successful');
        }
      } else {
        console.log('User does not have admin role, skipping hire_requests test');
      }
    } catch (hireRequestsError) {
      console.error('Error testing hire_requests table access:', hireRequestsError);
    }
    
    // Everything seems OK
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
