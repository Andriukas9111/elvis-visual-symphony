
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
      console.log('Testing profiles table access...');
      const { error: rlsTestError } = await supabase.rpc('check_profiles_access');
      
      if (rlsTestError) {
        console.error('RLS policy issue detected:', rlsTestError);
      } else {
        console.log('Profiles access check passed');
      }
    } catch (rlsError) {
      console.error('Error testing RLS policy:', rlsError);
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
