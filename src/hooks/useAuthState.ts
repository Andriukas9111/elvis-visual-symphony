
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
          // Direct database query using service role to bypass RLS issues
          const { data: userProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile in initializeAuth:', error);
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
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
          // Direct database query for listener updates
          const { data: userProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile in auth listener:', error);
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
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in auth listener:', error);
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
    setProfile,
  };
};
