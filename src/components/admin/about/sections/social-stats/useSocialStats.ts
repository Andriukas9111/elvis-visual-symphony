
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { SocialStat } from './types';

export const useSocialStats = () => {
  const queryClient = useQueryClient();
  const [stats, setStats] = useState<Partial<SocialStat>[]>([]);
  const { toast } = useToast();

  const { data: existingStats, isLoading } = useQuery({
    queryKey: ['socialStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_stats')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as SocialStat[];
    }
  });
  
  // Effect to populate state when data is loaded
  useEffect(() => {
    if (existingStats && stats.length === 0) {
      setStats(existingStats);
    }
  }, [existingStats, stats.length]);

  const updateMutation = useMutation({
    mutationFn: async (stats: Partial<SocialStat>[]) => {
      // Delete all existing stats
      await supabase.from('social_stats').delete().neq('id', '0');
      
      // Insert new stats
      const { data, error } = await supabase
        .from('social_stats')
        .insert(stats.map((stat, index) => ({
          ...stat,
          order_index: index
        })))
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialStats'] });
      toast({
        title: "Success!",
        description: "Social stats have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update social stats: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const addStat = () => {
    setStats([...stats, {
      title: '',
      value: '',
      icon: 'lucide-users',
      background_color: '#1A1A1A',
      text_color: '#FFFFFF',
      order_index: stats.length
    }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof SocialStat, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const handleSave = () => {
    updateMutation.mutate(stats);
  };

  return {
    stats,
    isLoading,
    updateMutation,
    addStat,
    removeStat,
    updateStat,
    handleSave
  };
};
