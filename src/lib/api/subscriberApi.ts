
import { supabase } from '../supabase';

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

export const deleteSubscriber = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting subscriber:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete subscriber:', error);
    throw error;
  }
};
