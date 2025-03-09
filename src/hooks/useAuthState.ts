
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
      // Get initial session
      const initialSession = await getCurrentSession();
      setSession(initialSession);
      
      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchUserProfile(currentUser.id);
        setProfile(userProfile);
        setIsAdmin(userProfile?.role === 'admin');
      }

      setLoading(false);
    };

    initializeAuth();

    // Set up auth listener
    const subscription = setupAuthListener(async (newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        const userProfile = await fetchUserProfile(newSession.user.id);
        setProfile(userProfile);
        setIsAdmin(userProfile?.role === 'admin');
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
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
