
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';
import AccomplishmentsList from './accomplishments/AccomplishmentsList';
import AccomplishmentsForm from './accomplishments/AccomplishmentsForm';
import AdminLoadingState from '../AdminLoadingState';

const AccomplishmentsEditor: React.FC = () => {
  const { data: stats, isLoading } = useStats();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    icon_name: 'Trophy',
    label: '',
    value: 0,
    suffix: '',
    sort_order: 0
  });
  
  // Handle add new
  const handleAddNew = () => {
    setFormData({
      icon_name: 'Trophy',
      label: '',
      value: 0,
      suffix: '',
      sort_order: stats ? stats.length : 0
    });
    setShowForm(true);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Accomplishments</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Accomplishment
        </Button>
      </div>
      
      {showForm ? (
        <AccomplishmentsForm
          formData={formData}
          setFormData={setFormData}
          onCancel={handleCancel}
          accomplishmentsCount={stats?.length || 0}
        />
      ) : (
        <AccomplishmentsList stats={stats || []} />
      )}
    </div>
  );
};

export default AccomplishmentsEditor;
