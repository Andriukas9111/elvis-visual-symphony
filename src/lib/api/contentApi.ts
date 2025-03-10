
import { supabase } from '../supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

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
