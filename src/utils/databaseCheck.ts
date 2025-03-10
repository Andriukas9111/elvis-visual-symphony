
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import * as api from '@/lib/api';

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
    
    // Test the is_admin() function directly
    const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin');
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
    
    // Get the current user
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
    
    // Check if user has a profile
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
      
      // Offer to fix the role
      if (confirm('Would you like to update your role to admin?')) {
        const { error: roleUpdateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userData.user.id);
          
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
    
    // Then try the actual function 
    try {
      const data = await api.getHireRequests();
      console.log('Successfully fetched hire requests via API function:', data);
      
      toast({
        title: 'Access Check Passed',
        description: `Successfully connected to hire_requests table and retrieved ${data.length} requests`,
      });
      
      return true;
    } catch (error) {
      console.error('Error using getHireRequests API function:', error);
      
      toast({
        title: 'API Function Error',
        description: error instanceof Error ? error.message : 'Unknown error in getHireRequests',
        variant: 'destructive',
      });
      
      return false;
    }
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
