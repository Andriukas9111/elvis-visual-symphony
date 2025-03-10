
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  } catch (err) {
    console.error('Exception in getCurrentSession:', err);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return user;
  } catch (err) {
    console.error('Exception in getCurrentUser:', err);
    return null;
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    console.log('Fetching profile for user ID:', userId);
    // Use a simpler query that's less likely to hit RLS issues
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log('Profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception in fetchUserProfile:', error);
    return null;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  } catch (error) {
    console.error('Exception in signInWithPassword:', error);
    return { data: { session: null, user: null }, error };
  }
};

export const signUpWithPassword = async (email: string, password: string, userData?: any) => {
  try {
    // First sign up the user
    const signUpResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    // If sign up was successful, create a profile entry
    if (signUpResponse.data.user && !signUpResponse.error) {
      const userId = signUpResponse.data.user.id;
      
      try {
        // Check if profile already exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking for existing profile:', profileError);
        }
        
        // If profile doesn't exist, create it
        if (!existingProfile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                full_name: userData?.full_name || '',
                role: 'user', // Default role is 'user'
              }
            ]);
            
          if (insertError) {
            console.error('Error creating profile during signup:', insertError);
          }
        }
      } catch (profileError) {
        console.error('Exception handling profile during signup:', profileError);
      }
    }

    return signUpResponse;
  } catch (error) {
    console.error('Exception in signUpWithPassword:', error);
    return { data: { session: null, user: null }, error };
  }
};

export const resetPasswordRequest = async (email: string) => {
  try {
    return await supabase.functions.invoke('auth-events', {
      body: {
        action: 'PASSWORD_RECOVERY',
        email
      }
    });
  } catch (error) {
    console.error('Exception in resetPasswordRequest:', error);
    return { error };
  }
};

export const signOutUser = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Exception in signOutUser:', error);
    return { error };
  }
};

export const setupAuthListener = (callback: (session: Session | null) => void) => {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        callback(session);
      }
    );

    return subscription;
  } catch (error) {
    console.error('Exception in setupAuthListener:', error);
    // Return a dummy subscription with an unsubscribe method
    return {
      unsubscribe: () => {
        console.log('Unsubscribing from dummy subscription');
      }
    };
  }
};
