
import { supabase } from './supabase';
import { Tables } from '@/types/supabase';

// Products API
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Media API
export const getMediaItems = async () => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const getFeaturedMedia = async () => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const getMediaByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Content API
export const getContentBySection = async (section: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('section', section)
    .eq('is_published', true)
    .order('ordering', { ascending: true });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Hire Requests API
export const submitHireRequest = async (request: Omit<Tables<'hire_requests'>, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('hire_requests')
    .insert([request])
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

// Orders API
export const getMyOrders = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// User profile API
export const updateProfile = async (profile: Partial<Tables<'profiles'>>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', user.id)
    .select();
    
  if (error) {
    throw error;
  }
  
  return data[0];
};

// Storage API helpers
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    
  if (error) {
    throw error;
  }
  
  return getPublicUrl(bucket, data.path);
};
