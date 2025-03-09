
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

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
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
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
