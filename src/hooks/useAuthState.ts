
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getCurrentSession, getCurrentUser, fetchUserProfile, setupAuthListener } from '@/services/authService';

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
          const userProfile = await fetchUserProfile(currentUser.id);
          console.log('User profile loaded:', userProfile);
          setProfile(userProfile);
          
          // Check if user is admin based on profile role
          const hasAdminRole = userProfile?.role === 'admin';
          console.log('User admin status:', hasAdminRole, userProfile?.role);
          setIsAdmin(hasAdminRole);
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
          const userProfile = await fetchUserProfile(newSession.user.id);
          console.log('User profile loaded in listener:', userProfile);
          setProfile(userProfile);
          
          // Check if user is admin based on profile role
          const hasAdminRole = userProfile?.role === 'admin';
          console.log('User admin status in listener:', hasAdminRole, userProfile?.role);
          setIsAdmin(hasAdminRole);
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
