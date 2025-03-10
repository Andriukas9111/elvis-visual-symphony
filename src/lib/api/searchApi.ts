
import { supabase } from '../supabase';

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
