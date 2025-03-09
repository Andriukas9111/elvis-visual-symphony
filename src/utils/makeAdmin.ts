
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const makeUserAdmin = async (email: string) => {
  try {
    console.log(`Attempting to make ${email} an admin...`);
    
    const { data, error } = await supabase.functions.invoke('make-admin', {
      body: { email }
    });
    
    if (error) {
      console.error('Function error:', error);
      throw error;
    }
    
    console.log('Response from make-admin function:', data);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error making user admin:', error);
    return { success: false, error };
  }
};

// Export a React hook for easier use in components
export const useMakeAdmin = () => {
  const { toast } = useToast();
  
  const makeAdmin = async (email: string) => {
    const result = await makeUserAdmin(email);
    
    if (result.success) {
      toast({
        title: 'Success!',
        description: `User ${email} has been made an admin`,
      });
      return true;
    } else {
      toast({
        title: 'Error making user admin',
        description: result.error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return makeAdmin;
};
