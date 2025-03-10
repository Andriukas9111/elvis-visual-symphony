
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
    
    // Check for admin status using the security definer function
    try {
      console.log('Checking admin status using get_admin_status function...');
      const { data: isAdmin, error: adminStatusError } = await supabase.rpc('get_admin_status');
      
      if (adminStatusError) {
        console.error('Error checking admin status:', adminStatusError);
        console.error('Error details:', JSON.stringify(adminStatusError));
      } else {
        console.log('Admin status check result:', isAdmin);
        
        if (isAdmin) {
          // Test hire_requests access directly with the new policy
          console.log('Testing hire_requests access with security definer function...');
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
          } else {
            console.log('Hire requests access successful:', hireRequestsTest);
            toast({
              title: 'Access Check Passed',
              description: 'Successfully connected to hire_requests table',
            });
          }
        } else {
          console.log('User is not an admin, skipping hire_requests check');
        }
      }
    } catch (adminCheckError) {
      console.error('Exception in admin status check:', adminCheckError);
    }
    
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
