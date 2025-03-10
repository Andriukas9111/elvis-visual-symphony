
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
        
        toast({
          title: 'Admin Status Check Failed',
          description: `Error: ${adminStatusError.message}. The security definer function might not be working correctly.`,
          variant: 'destructive',
        });
      } else {
        console.log('Admin status check result:', isAdmin);
        
        if (isAdmin) {
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
            
            // Try testing another method to diagnose RLS issues
            console.log('Attempting alternative access method for diagnostics...');
            const { error: directFetchError } = await supabase
              .from('hire_requests')
              .select('id')
              .limit(1);
              
            if (directFetchError) {
              console.error('Alternative access also failed:', directFetchError);
              
              // Check if this is due to the RLS policy not being applied correctly
              if (directFetchError.message.includes('permission denied')) {
                toast({
                  title: 'RLS Policy Issue Detected',
                  description: 'The Row Level Security policy for hire_requests is not correctly applying the admin privileges',
                  variant: 'destructive',
                });
              }
            }
          } else {
            console.log('Hire requests access successful:', hireRequestsTest);
            toast({
              title: 'Access Check Passed',
              description: 'Successfully connected to hire_requests table',
            });
          }
        } else {
          console.log('User is not an admin, skipping hire_requests check');
          toast({
            title: 'Admin Check Failed',
            description: 'You are not detected as an admin user. This might be why you cannot access hire requests.',
            variant: 'destructive',
          });
        }
      }
    } catch (adminCheckError) {
      console.error('Exception in admin status check:', adminCheckError);
      toast({
        title: 'Admin Check Exception',
        description: `An unexpected error occurred checking admin status: ${adminCheckError instanceof Error ? adminCheckError.message : 'Unknown error'}`,
        variant: 'destructive',
      });
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
          toast({
            title: 'Profile Check Passed',
            description: `Your role is: ${userProfile.role || 'not set'}`,
          });
          
          // If the user doesn't have admin role, suggest fixing it
          if (userProfile.role !== 'admin') {
            toast({
              title: 'Role Issue Detected',
              description: 'Your user does not have admin role. This is required to access hire requests.',
              variant: 'destructive',
            });
          }
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
