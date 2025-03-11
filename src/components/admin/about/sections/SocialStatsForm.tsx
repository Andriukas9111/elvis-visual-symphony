
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import IconSelector from '../ui/IconSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface SocialStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  background_color?: string;
  text_color?: string;
  order_index: number;
}

const SocialStatsForm = () => {
  const queryClient = useQueryClient();
  const [stats, setStats] = React.useState<Partial<SocialStat>[]>([]);

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
  React.useEffect(() => {
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
    }
  });

  const addStat = () => {
    setStats([...stats, {
      title: '',
      value: '',
      icon: 'lucide-users',
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Statistics</h2>
        <Button onClick={addStat} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Stat
        </Button>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={stat.title}
                    onChange={(e) => updateStat(index, 'title', e.target.value)}
                    placeholder="e.g., Projects Completed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="e.g., 100+"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Icon</label>
                  <IconSelector
                    value={stat.icon || ''}
                    onChange={(value) => updateStat(index, 'icon', value)}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStat(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SocialStatsForm;
