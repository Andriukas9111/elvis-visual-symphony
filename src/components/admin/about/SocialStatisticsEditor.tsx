
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';
import SocialStatisticsList from './social-statistics/SocialStatisticsList';
import SocialStatisticsForm from './social-statistics/SocialStatisticsForm';
import AdminLoadingState from '../AdminLoadingState';

const SocialStatisticsEditor: React.FC = () => {
  const { data: stats, isLoading, error } = useStats();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    icon_name: 'Instagram',
    label: '',
    value: 0,
    suffix: '',
    sort_order: 0
  });
  
  // Handle edit click
  const handleEdit = (stat: any) => {
    setFormData(stat);
    setIsEditing(stat.id);
    setShowForm(true);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    // Will be implemented with the useDeleteStat hook
    if (confirm("Are you sure you want to delete this statistic?")) {
      // Delete functionality will be handled by the SocialStatisticsList component
    }
  };
  
  // Handle move up
  const handleMoveUp = (index: number) => {
    // Will be implemented with array reordering and the useReorderStats hook
    if (index === 0 || !stats) return;
    
    // Reordering will be handled by the SocialStatisticsList component
  };
  
  // Handle move down
  const handleMoveDown = (index: number) => {
    // Will be implemented with array reordering and the useReorderStats hook
    if (!stats || index === stats.length - 1) return;
    
    // Reordering will be handled by the SocialStatisticsList component
  };
  
  // Handle add new
  const handleAddNew = () => {
    setFormData({
      icon_name: 'Instagram',
      label: '',
      value: 0,
      suffix: '',
      sort_order: stats ? stats.length : 0
    });
    setIsEditing(null);
    setShowForm(true);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(null);
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Social Statistics</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Statistic
        </Button>
      </div>
      
      {showForm ? (
        <SocialStatisticsForm
          formData={formData}
          setFormData={setFormData}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      ) : (
        <SocialStatisticsList
          stats={stats || []}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SocialStatisticsEditor;
