
import { supabase } from '../supabase';
import { Tables, Updatable } from '@/types/supabase';

// Profile functions
export const getCurrentProfile = async (): Promise<Tables<'profiles'> | null> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting current user:', authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.log('No authenticated user found');
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching current profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get current profile:', error);
    throw error;
  }
};

export const updateProfile = async (updates: Updatable<'profiles'>): Promise<Tables<'profiles'>> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      throw new Error('No authenticated user found');
    }
    
    console.log(`Updating profile for user ${authData.user.id}:`, updates);
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authData.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};
