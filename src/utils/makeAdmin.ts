
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
      
      if (result.data.credentials) {
        // If credentials were returned (new user was created)
        toast({
          title: 'Admin Credentials',
          description: `Email: ${result.data.credentials.email}\nPassword: ${result.data.credentials.password}\n${result.data.credentials.note}`,
          duration: 10000,
        });
      }
      
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

// Create a standalone function to create an admin user directly
export const createAdminUser = async (email: string) => {
  console.log(`Creating admin user with email: ${email}`);
  return await makeUserAdmin(email);
};

// Expose the function globally for console access
if (typeof window !== 'undefined') {
  (window as any).createAdminUser = createAdminUser;
}

// Immediately invoke the function to create an admin user with the specified email
if (typeof window !== 'undefined') {
  (async () => {
    console.log("Automatically creating admin user...");
    const result = await createAdminUser('fearas2@gmail.com');
    console.log("Admin user creation result:", result);
  })();
}
