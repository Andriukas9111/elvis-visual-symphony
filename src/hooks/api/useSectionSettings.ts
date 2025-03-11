
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export interface SectionSetting {
  id: string;
  section_name: string;
  title: string;
  subtitle?: string;
  is_visible: boolean;
  order_index: number;
}

export const useSectionSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, error, isLoading } = useQuery({
    queryKey: ['section-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_section_settings')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return (data || []) as SectionSetting[];
    }
  });

  const updateSectionSettings = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SectionSetting> }) => {
      const { error } = await supabase
        .from('about_section_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-settings'] });
      toast.success('Section settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating section settings:', error);
      toast.error('Failed to update section settings');
    }
  });

  return {
    settings,
    isLoading,
    error,
    updateSectionSettings
  };
};
