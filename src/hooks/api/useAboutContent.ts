
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useAboutContent = () => {
  const queryClient = useQueryClient();

  const { data: aboutData, error, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_about_section');
      
      if (error) {
        console.error('Error fetching about section data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const updateAboutContent = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('about_content')
        .update(updates)
        .eq('id', aboutData?.about_content?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
      toast.success('About content updated successfully');
    },
    onError: (error) => {
      console.error('Error updating about content:', error);
      toast.error('Failed to update about content');
    }
  });

  return {
    aboutData,
    isLoading,
    error,
    updateAboutContent
  };
};
