
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  signInWithPassword, 
  signUpWithPassword, 
  resetPasswordRequest, 
  signOutUser 
} from '@/services/authService';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await signInWithPassword(email, password);

      if (error) {
        console.error('Login failed:', error);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { error } = await signUpWithPassword(email, password, userData);

      if (error) {
        console.error('Registration failed:', error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Registration successful',
        description: 'Please check your email to confirm your account.',
      });

    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await resetPasswordRequest(email);
      
      if (error) {
        console.error('Password reset failed:', error);
        toast({
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a link to reset your password.',
      });

    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await signOutUser();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: 'Error signing out',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Signed out',
        description: 'You have successfully signed out.',
      });

    } catch (error: any) {
      console.error('Error signing out:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    resetPassword,
    signOut,
    authLoading: loading,
  };
};
