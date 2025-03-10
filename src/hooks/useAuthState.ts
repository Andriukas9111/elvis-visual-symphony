
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getCurrentSession, getCurrentUser, fetchUserProfile, setupAuthListener } from '@/services/authService';
import { supabase } from '@/lib/supabase';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state and set up listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const initialSession = await getCurrentSession();
        setSession(initialSession);
        
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            // Direct database query using service role to bypass RLS issues
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile in initializeAuth:', profileError);
              setError(`Profile fetch error: ${profileError.message}`);
            } else {
              console.log('User profile loaded directly:', userProfile);
              setProfile(userProfile);
              
              // Set admin status
              const hasAdminRole = userProfile?.role === 'admin';
              console.log('Admin check:', { 
                hasAdminRole, 
                role: userProfile?.role, 
                email: currentUser.email 
              });
              setIsAdmin(hasAdminRole);
            }
          } catch (profileFetchError) {
            console.error('Exception in profile fetch:', profileFetchError);
            setError(`Profile fetch exception: ${(profileFetchError as Error).message}`);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(`Auth initialization failed: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth listener
    const subscription = setupAuthListener(async (newSession) => {
      try {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          try {
            // Direct database query for listener updates
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile in auth listener:', profileError);
              setError(`Profile fetch error in listener: ${profileError.message}`);
            } else {
              console.log('User profile loaded in listener:', userProfile);
              setProfile(userProfile);
              
              // Set admin status
              const hasAdminRole = userProfile?.role === 'admin';
              console.log('Admin status in listener:', { 
                hasAdminRole, 
                role: userProfile?.role, 
                email: newSession.user.email 
              });
              setIsAdmin(hasAdminRole);
            }
          } catch (profileFetchError) {
            console.error('Exception in profile fetch in listener:', profileFetchError);
            setError(`Profile fetch exception in listener: ${(profileFetchError as Error).message}`);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in auth listener:', error);
        setError(`Auth listener error: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    isAdmin,
    error,
    setProfile,
  };
};
