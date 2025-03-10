
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';

// Search hook
export const useSearch = (
  query: string,
  options?: {
    tables?: Array<'products' | 'media' | 'content'>;
    limit?: number;
  },
  queryOptions?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => api.search(query, options),
    enabled: query.length > 2, // Only search when query is at least 3 characters
    ...queryOptions,
  });
};
