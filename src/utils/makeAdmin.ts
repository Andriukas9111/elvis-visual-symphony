
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const makeUserAdmin = async (email: string) => {
  try {
    console.log(`Attempting to make ${email} an admin...`);
    
    // Capture start time for performance tracking
    const startTime = performance.now();
    
    const { data, error } = await supabase.functions.invoke('make-admin', {
      body: { email }
    });
    
    // Calculate response time
    const responseTime = performance.now() - startTime;
    console.log(`make-admin function response time: ${responseTime.toFixed(2)}ms`);
    
    if (error) {
      console.error('Function error:', error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log('Response from make-admin function:', data);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error making user admin:', error);
    console.error('Error details:', JSON.stringify(error));
    return { success: false, error };
  }
};

// Export a React hook for easier use in components
export const useMakeAdmin = () => {
  const { toast } = useToast();
  
  const makeAdmin = async (email: string) => {
    try {
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
    } catch (error) {
      console.error('Exception in makeAdmin hook:', error);
      console.error('Error details:', JSON.stringify(error));
      toast({
        title: 'Error making user admin',
        description: (error as Error).message || 'Unknown error occurred',
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
  try {
    const result = await makeUserAdmin(email);
    console.log('Admin creation result:', result);
    return result;
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    console.error('Error details:', JSON.stringify(error));
    return { success: false, error };
  }
};

// Export a utility function to diagnose admin issues
export const diagnoseAdminIssues = async (email: string) => {
  console.log(`Diagnosing admin issues for ${email}...`);
  try {
    // Check if user exists
    const { data, error: userError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    
    if (userError) {
      console.error('Error getting users:', userError);
      return { success: false, error: userError, stage: 'user-lookup' };
    }
    
    // Find the user by email in the returned list
    const user = data?.users?.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: { message: 'User not found' }, stage: 'user-not-found' };
    }
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error getting profile:', profileError);
      return { success: false, error: profileError, stage: 'profile-lookup', userId: user.id };
    }
    
    // Check role
    if (!profile.role || profile.role !== 'admin') {
      // Try to update role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating role:', updateError);
        return { success: false, error: updateError, stage: 'role-update', profile };
      }
    }
    
    return { success: true, user, profile };
  } catch (error) {
    console.error('Exception in diagnoseAdminIssues:', error);
    return { success: false, error, stage: 'exception' };
  }
};

// Expose the functions globally for console access
if (typeof window !== 'undefined') {
  (window as any).createAdminUser = createAdminUser;
  (window as any).diagnoseAdminIssues = diagnoseAdminIssues;
}

// This function runs when the user visits the admin page
// and attempts to make your account an admin automatically
export const initializeAdmin = async () => {
  if (typeof window !== 'undefined') {
    try {
      console.log("Checking current user...");
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;
      
      if (email === "fearas2@gmail.com") {
        console.log("Found matching user, attempting to grant admin privileges...");
        const result = await createAdminUser(email);
        console.log("Admin user creation result:", result);
        return result;
      } else {
        console.log("Current user is not the target admin email");
      }
    } catch (error) {
      console.error("Error in initializeAdmin:", error);
    }
  }
  return null;
};
