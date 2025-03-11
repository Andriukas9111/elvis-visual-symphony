
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStatManagement } from '@/hooks/admin/useStatManagement';
import StatForm from './stats/StatForm';
import StatItem from './stats/StatItem';

const StatsEditor: React.FC = () => {
  const {
    stats,
    isLoading,
    isEditing,
    editedItem,
    isAddingNew,
    newItem,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    handleAddNew,
    handleNewItemChange,
    handleEditItemChange,
    setIsAddingNew
  } = useStatManagement();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-300/20 rounded"></div>
        <div className="h-32 bg-gray-300/10 rounded"></div>
        <div className="h-32 bg-gray-300/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Manage the statistics displayed on the about page
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingNew && (
            <StatForm
              item={newItem}
              onSave={handleAddNew}
              onCancel={() => setIsAddingNew(false)}
              onChange={handleNewItemChange}
              isNew={true}
              title="Add New Statistic"
            />
          )}

          <div className="space-y-4">
            {stats && stats.length > 0 ? (
              stats.map((item) => (
                <StatItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing === item.id}
                  editedItem={editedItem}
                  onEdit={handleEdit}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                  onDelete={handleDelete}
                  onEditItemChange={handleEditItemChange}
                />
              ))
            ) : (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No statistics added yet. Add your first statistic to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsEditor;
