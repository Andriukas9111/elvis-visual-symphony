
import { supabase } from '../supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

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
    
    // This will rely on the RLS policy using the is_admin() function
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
    
    // RLS will handle the admin-only check using the is_admin() function
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
