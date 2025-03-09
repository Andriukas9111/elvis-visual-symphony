
import { supabase } from '@/lib/supabase';

export const makeUserAdmin = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('make-admin', {
      body: { email }
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error making user admin:', error);
    return { success: false, error };
  }
};

// Call this function to make fearas2@gmail.com an admin
// You can run this in the browser console:
// import { makeUserAdmin } from '@/utils/makeAdmin';
// makeUserAdmin('fearas2@gmail.com');
