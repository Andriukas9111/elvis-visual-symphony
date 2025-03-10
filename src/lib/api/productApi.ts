
import { supabase } from '../supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

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
