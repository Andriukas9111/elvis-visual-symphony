import { supabase } from './supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

// Media functions
export const getMedia = async (options?: { 
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  tags?: string[];
  orientation?: string;
}) => {
  try {
    console.log('Fetching media from Supabase with options:', options);
    
    let query = supabase
      .from('media')
      .select('*');
    
    // Apply filters if they exist
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options?.orientation) {
      query = query.eq('orientation', options.orientation);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.search) {
      query = query.ilike('title', `%${options.search}%`);
    }
    
    if (options?.tags && options.tags.length > 0) {
      // Filter by array overlap for tags
      query = query.contains('tags', options.tags);
    }
    
    // Apply default ordering
    query = query
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching media:', error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} media items`);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch media:', error);
    throw error;
  }
};

export const getMediaBySlug = async (slug: string): Promise<Tables<'media'> | null> => {
  try {
    console.log(`Fetching media with slug: ${slug}`);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`No media found with slug: ${slug}`);
        return null;
      }
      console.error(`Error fetching media with slug ${slug}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch media by slug:', error);
    throw error;
  }
};

export const createMedia = async (media: Insertable<'media'>): Promise<Tables<'media'>> => {
  try {
    console.log('Creating new media item:', media);
    const { data, error } = await supabase
      .from('media')
      .insert(media)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media:', error);
      throw error;
    }
    
    console.log('Media created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create media:', error);
    throw error;
  }
};

export const updateMedia = async (id: string, updates: Updatable<'media'>): Promise<Tables<'media'>> => {
  try {
    console.log(`Updating media with id ${id}:`, updates);
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating media ${id}:`, error);
      throw error;
    }
    
    console.log('Media updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update media:', error);
    throw error;
  }
};

export const deleteMedia = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting media with id: ${id}`);
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting media ${id}:`, error);
      throw error;
    }
    
    console.log(`Media ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Failed to delete media:', error);
    throw error;
  }
};

export const updateMediaSortOrder = async (updates: { id: string; sort_order: number }[]): Promise<boolean> => {
  try {
    console.log('Updating media sort order:', updates);
    
    // Create an array of promises for each update
    const updatePromises = updates.map(({ id, sort_order }) => 
      supabase
        .from('media')
        .update({ sort_order })
        .eq('id', id)
    );
    
    // Execute all updates in parallel
    await Promise.all(updatePromises);
    
    console.log('Media sort order updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update media sort order:', error);
    throw error;
  }
};

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

// Product functions
export const getProducts = async (options?: { 
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  tags?: string[];
}): Promise<Tables<'products'>[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters if they exist
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    
    if (options?.featured) {
      query = query.eq('is_featured', true);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    // Apply default ordering
    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string): Promise<Tables<'products'> | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`No product found with slug: ${slug}`);
        return null;
      }
      console.error(`Error fetching product with slug ${slug}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch product by slug:', error);
    throw error;
  }
};

export const createProduct = async (product: Insertable<'products'>): Promise<Tables<'products'>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Updatable<'products'>): Promise<Tables<'products'>> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

// Order functions
export const getOrders = async (userId?: string): Promise<Tables<'orders'>[]> => {
  try {
    let query = supabase
      .from('orders')
      .select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Tables<'orders'> | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`No order found with id: ${id}`);
        return null;
      }
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch order by id:', error);
    throw error;
  }
};

export const createOrder = async (order: Insertable<'orders'>): Promise<Tables<'orders'>> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, updates: Updatable<'orders'>): Promise<Tables<'orders'>> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
};

// Content functions
export const getContent = async (section?: string): Promise<Tables<'content'>[]> => {
  try {
    let query = supabase
      .from('content')
      .select('*');
    
    if (section) {
      query = query.eq('section', section);
    }
    
    query = query
      .order('ordering', { ascending: true })
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch content:', error);
    throw error;
  }
};

export const createContent = async (content: Insertable<'content'>): Promise<Tables<'content'>> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert(content)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating content:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create content:', error);
    throw error;
  }
};

export const updateContent = async (id: string, updates: Updatable<'content'>): Promise<Tables<'content'>> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating content ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update content:', error);
    throw error;
  }
};

export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting content ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete content:', error);
    throw error;
  }
};

// Hire request functions
export const submitHireRequest = async (request: Insertable<'hire_requests'>): Promise<Tables<'hire_requests'>> => {
  try {
    console.log('Submitting hire request:', request);
    const { data, error } = await supabase
      .from('hire_requests')
      .insert(request)
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting hire request:', error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log('Hire request submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to submit hire request:', error);
    console.error('Error details:', JSON.stringify(error));
    throw error;
  }
};

export const getHireRequests = async (): Promise<Tables<'hire_requests'>[]> => {
  try {
    console.log('Fetching hire requests');
    // Use RPC function call to avoid RLS issues with direct table access
    const { data: adminCheck, error: adminCheckError } = await supabase.rpc('get_user_role');
    
    if (adminCheckError) {
      console.error('Error checking admin role:', adminCheckError);
      throw new Error(`Admin role check failed: ${adminCheckError.message}`);
    }
    
    if (adminCheck !== 'admin') {
      console.error('User is not an admin, denying access');
      throw new Error('Access denied: Only admins can view hire requests');
    }
    
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching hire requests:', error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} hire requests`);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch hire requests:', error);
    console.error('Error details:', error instanceof Error ? error.message : JSON.stringify(error));
    throw error;
  }
};

export const updateHireRequest = async (id: string, updates: Updatable<'hire_requests'>): Promise<Tables<'hire_requests'>> => {
  try {
    console.log(`Updating hire request ${id}:`, updates);
    
    // Verify admin role before attempting update
    const { data: adminCheck, error: adminCheckError } = await supabase.rpc('get_user_role');
    
    if (adminCheckError) {
      console.error('Error checking admin role for update:', adminCheckError);
      throw new Error(`Admin role check failed: ${adminCheckError.message}`);
    }
    
    if (adminCheck !== 'admin') {
      console.error('User is not an admin, denying update access');
      throw new Error('Access denied: Only admins can update hire requests');
    }
    
    const { data, error } = await supabase
      .from('hire_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating hire request ${id}:`, error);
      console.error('Error details:', JSON.stringify(error));
      throw error;
    }
    
    console.log('Hire request updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update hire request:', error);
    console.error('Error details:', error instanceof Error ? error.message : JSON.stringify(error));
    throw error;
  }
};

// Subscriber functions
export const submitSubscriber = async (email: string): Promise<any> => {
  try {
    console.log('Submitting new subscriber:', email);
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select()
      .single();
    
    if (error) {
      // Handle duplicate entries gracefully
      if (error.code === '23505') {
        console.log('Email already subscribed:', email);
        return { message: 'You are already subscribed! Thank you.' };
      }
      console.error('Error submitting subscriber:', error);
      throw error;
    }
    
    console.log('Subscriber submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to submit subscriber:', error);
    throw error;
  }
};

export const getSubscribers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    throw error;
  }
};

// File functions
export const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  try {
    console.log(`Uploading file to ${bucket}/${path}`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log('File uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    console.log(`Deleting file from ${bucket}/${path}`);
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

// Search function
export const search = async (
  query: string,
  options?: {
    tables?: Array<'products' | 'media' | 'content'>;
    limit?: number;
  }
): Promise<any> => {
  try {
    const tables = options?.tables || ['products', 'media', 'content'];
    const limit = options?.limit || 10;
    const results: Record<string, any[]> = {};
    
    const searchPromises = tables.map(async (table) => {
      if (table === 'products') {
        const { data } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(limit);
        return { table, data: data || [] };
      } else if (table === 'media') {
        const { data } = await supabase
          .from('media')
          .select('*')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(limit);
        return { table, data: data || [] };
      } else if (table === 'content') {
        const { data } = await supabase
          .from('content')
          .select('*')
          .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
          .limit(limit);
        return { table, data: data || [] };
      }
      return { table, data: [] };
    });
    
    const searchResults = await Promise.all(searchPromises);
    
    searchResults.forEach(({ table, data }) => {
      results[table] = data;
    });
    
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};
