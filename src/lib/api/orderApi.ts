
import { supabase } from '../supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

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
