
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
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
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithPassword = async (email: string, password: string, userData?: any) => {
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
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: userData?.full_name || '',
            role: 'user', // Default role is 'user'
          }
        ]);
    }
  }

  return signUpResponse;
};

export const resetPasswordRequest = async (email: string) => {
  return await supabase.functions.invoke('auth-events', {
    body: {
      action: 'PASSWORD_RECOVERY',
      email
    }
  });
};

export const signOutUser = async () => {
  return await supabase.auth.signOut();
};

export const setupAuthListener = (callback: (session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      callback(session);
    }
  );

  return subscription;
};
