
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getCurrentSession, getCurrentUser, fetchUserProfile, setupAuthListener } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { checkDatabaseConnection } from '@/utils/databaseCheck';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load the user profile and check admin status
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user ID:', userId);
      
      // First try using the security definer function to get the role
      try {
        const { data: roleData, error: roleError } = await supabase.rpc('get_user_role');
        if (roleError) {
          console.error('Error fetching user role via security definer function:', roleError);
        } else {
          console.log('User role via security definer function:', roleData);
          // If we got the role, we can use it to set admin status
          if (roleData) {
            const hasAdminRole = roleData === 'admin';
            console.log('Admin status via security definer function:', { hasAdminRole, role: roleData });
            setIsAdmin(hasAdminRole);
          }
        }
      } catch (roleError) {
        console.error('Exception in role fetch via security definer:', roleError);
      }
      
      // Direct database query using the admin policy that uses the security definer
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        console.error('Error details:', JSON.stringify(profileError));
        setError(`Profile fetch error: ${profileError.message}`);
        
        // Try to diagnose the issue
        checkDatabaseConnection();
      } else {
        console.log('User profile loaded successfully:', userProfile);
        setProfile(userProfile);
        
        // Set admin status based on profile role
        const hasAdminRole = userProfile?.role === 'admin';
        console.log('Admin check:', { 
          hasAdminRole, 
          role: userProfile?.role, 
          userId 
        });
        setIsAdmin(hasAdminRole);
      }
    } catch (profileFetchError) {
      console.error('Exception in profile fetch:', profileFetchError);
      setError(`Profile fetch exception: ${(profileFetchError as Error).message}`);
    }
  };

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
          await loadUserProfile(currentUser.id);
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
          await loadUserProfile(newSession.user.id);
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

  // Expose a function to refresh the profile
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  return {
    session,
    user,
    profile,
    loading,
    isAdmin,
    error,
    setProfile,
    refreshProfile
  };
};
