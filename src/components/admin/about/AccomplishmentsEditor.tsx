
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useStats } from '@/hooks/api/useStats';
import { Plus } from 'lucide-react';
import AdminLoadingState from '../AdminLoadingState';
import AccomplishmentsForm from './accomplishments/AccomplishmentsForm';
import AccomplishmentsList from './accomplishments/AccomplishmentsList';

const AccomplishmentsEditor: React.FC = () => {
  const { toast } = useToast();
  const { data: allStats, isLoading } = useStats();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    icon_name: 'CheckCircle',
    label: '',
    value: 0,
    suffix: '',
    sort_order: 0
  });

  // Filter stats that should appear in Key Accomplishments (not in Social Statistics)
  // This typically includes stats like Awards, Experience, Client Satisfaction
  const accomplishmentStats = allStats?.filter(
    stat => !['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];

  const handleAddNew = () => {
    setFormData({
      icon_name: 'CheckCircle',
      label: '',
      value: 0,
      suffix: '+',
      sort_order: accomplishmentStats.length
    });
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Key Accomplishments</h2>
          <p className="text-sm text-muted-foreground">
            Manage your key accomplishments shown in the About section
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={isAdding} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Accomplishment
        </Button>
      </div>

      {isAdding && (
        <AccomplishmentsForm 
          formData={formData}
          setFormData={setFormData}
          onCancel={handleCancelAdd}
          accomplishmentsCount={accomplishmentStats.length}
        />
      )}

      <AccomplishmentsList stats={accomplishmentStats} />
    </div>
  );
};

export default AccomplishmentsEditor;
