
import { useQuery } from '@tanstack/react-query';

// Define basic types to replace the removed ones
export interface BasicStatData {
  id: string;
  title: string;
  value: number;
  icon_name?: string;
  prefix?: string;
  suffix?: string;
  sort_order?: number;
  label?: string;
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Simplified function returning basic stats
      return [] as BasicStatData[];
    },
  });
};
