import { supabase } from './supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

// Authentication API
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCurrentProfile:', error);
    return null;
  }
};

export const updateProfile = async (updates: Updatable<'profiles'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

// Media API
export const getMedia = async (options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  tags?: string[];
}) => {
  try {
    let query = supabase
      .from('media')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
      
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured !== undefined) {
      query = query.eq('is_featured', options.featured);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.overlaps('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getMedia:', error);
    throw error;
  }
};

export const getMediaBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      console.error('Error fetching media by slug:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getMediaBySlug:', error);
    throw error;
  }
};

export const createMedia = async (media: Insertable<'media'>) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .insert([media])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating media:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createMedia:', error);
    throw error;
  }
};

export const updateMedia = async (id: string, updates: Updatable<'media'>) => {
  try {
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating media:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateMedia:', error);
    throw error;
  }
};

export const deleteMedia = async (id: string) => {
  try {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMedia:', error);
    throw error;
  }
};

// Products API
export const getProducts = async (options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  tags?: string[];
}) => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
      
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured !== undefined) {
      query = query.eq('is_featured', options.featured);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.overlaps('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      console.error('Error fetching product by slug:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    throw error;
  }
};

export const createProduct = async (product: Insertable<'products'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Updatable<'products'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};

// Orders API
export const getOrders = async (userId?: string) => {
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching order by id:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

export const createOrder = async (order: Insertable<'orders'>) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, updates: Updatable<'orders'>) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateOrder:', error);
    throw error;
  }
};

export const incrementOrderDownloadCount = async (id: string) => {
  try {
    const { data, error } = await supabase.rpc('increment_download_count', { order_id: id });
    
    if (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in incrementOrderDownloadCount:', error);
    throw error;
  }
};

// Content API
export const getContent = async (section?: string) => {
  try {
    let query = supabase
      .from('content')
      .select('*')
      .eq('is_published', true)
      .order('ordering', { ascending: true });
      
    if (section) {
      query = query.eq('section', section);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getContent:', error);
    throw error;
  }
};

export const createContent = async (content: Insertable<'content'>) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert([content])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating content:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createContent:', error);
    throw error;
  }
};

export const updateContent = async (id: string, updates: Updatable<'content'>) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateContent:', error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteContent:', error);
    throw error;
  }
};

// Hire Requests API
export const submitHireRequest = async (request: Insertable<'hire_requests'>) => {
  try {
    const { data, error } = await supabase
      .from('hire_requests')
      .insert([request])
      .select()
      .single();
      
    if (error) {
      console.error('Error submitting hire request:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in submitHireRequest:', error);
    throw error;
  }
};

export const getHireRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching hire requests:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getHireRequests:', error);
    throw error;
  }
};

export const updateHireRequest = async (id: string, updates: Updatable<'hire_requests'>) => {
  try {
    const { data, error } = await supabase
      .from('hire_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating hire request:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateHireRequest:', error);
    throw error;
  }
};

// Storage API helpers
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadFile = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    return getPublicUrl(bucket, data.path);
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
};

// Analytics tracking
export const trackEvent = async (eventName: string, eventData: any) => {
  try {
    // This is a simple implementation. In a production environment,
    // you might want to use a dedicated analytics service.
    const { data: { user } } = await supabase.auth.getUser();
    
    const event = {
      event_name: eventName,
      event_data: eventData,
      user_id: user?.id || null,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Tracking event:', event);
    
    // You could store this in a separate table if you implement analytics
    // const { data, error } = await supabase
    //   .from('analytics_events')
    //   .insert([event]);
    
    return true;
  } catch (error) {
    console.error('Error tracking event:', error);
    return false;
  }
};

// Search functionality
export const search = async (query: string, options?: {
  tables?: Array<'products' | 'media' | 'content'>;
  limit?: number;
}) => {
  try {
    const tables = options?.tables || ['products', 'media', 'content'];
    const limit = options?.limit || 10;
    const results: any = {};
    
    if (tables.includes('products')) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);
        
      results.products = data || [];
    }
    
    if (tables.includes('media')) {
      const { data } = await supabase
        .from('media')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);
        
      results.media = data || [];
    }
    
    if (tables.includes('content')) {
      const { data } = await supabase
        .from('content')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);
        
      results.content = data || [];
    }
    
    return results;
  } catch (error) {
    console.error('Error in search:', error);
    throw error;
  }
};

// Secure Download API
export const generateDownloadLink = async (orderId: string, productId: string) => {
  try {
    const { data, error } = await supabase.rpc('generate_download_link', {
      order_id: orderId,
      product_id: productId
    });
    
    if (error) {
      console.error('Error generating download link:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in generateDownloadLink:', error);
    throw error;
  }
};

export const validateDownloadToken = async (token: string) => {
  try {
    const { data, error } = await supabase.rpc('validate_download_token', {
      token: token
    });
    
    if (error) {
      console.error('Error validating download token:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in validateDownloadToken:', error);
    throw error;
  }
};
