
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
      toast({
        title: 'Database Connection Error',
        description: 'Unable to connect to the database. Please try again later.',
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Database connection successful');
    
    // Check if media table is accessible
    const { data: mediaItems, error: mediaError } = await supabase
      .from('media')
      .select('id, title')
      .limit(5);
      
    if (mediaError) {
      console.error('Media table access error:', mediaError);
      toast({
        title: 'Media Access Error',
        description: 'Unable to access media data. This may be due to permission issues.',
        variant: 'destructive',
      });
      return false;
    }
    
    console.log(`Found ${mediaItems?.length || 0} media items in quick check`);
    
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
