import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use environment variables where possible, but keep the existing values as fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxlaikphdjcjjtyxfvpz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGFpa3BoZGpjamp0eXhmdnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDg4MTgsImV4cCI6MjA1NzAyNDgxOH0.CBwaRYwvcwIizUmZG2ExY7Q1OPtMSwy1xFFBhGyqTYI';

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add utility function to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Add utility function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
