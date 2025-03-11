
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAccomplishmentManagement } from '@/hooks/admin/useAccomplishmentManagement';
import AccomplishmentForm from './accomplishments/AccomplishmentForm';
import AccomplishmentItem from './accomplishments/AccomplishmentItem';

const AccomplishmentsManagement: React.FC = () => {
  const {
    accomplishments,
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
    handleMoveUp,
    handleMoveDown,
    handleNewItemChange,
    handleEditItemChange,
    setIsAddingNew
  } = useAccomplishmentManagement();

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
            <CardTitle>Key Accomplishments</CardTitle>
            <CardDescription>
              Manage the key accomplishments displayed on your about page
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingNew && (
            <AccomplishmentForm
              item={newItem}
              onSave={handleAddNew}
              onCancel={() => setIsAddingNew(false)}
              onChange={handleNewItemChange}
              isNew={true}
              title="Add New Accomplishment"
            />
          )}

          <div className="space-y-4">
            {accomplishments && accomplishments.length > 0 ? (
              accomplishments.map((item, index) => (
                <AccomplishmentItem
                  key={item.id}
                  item={item}
                  index={index}
                  isEditing={isEditing === item.id}
                  editedItem={editedItem}
                  totalItems={accomplishments.length}
                  onEdit={handleEdit}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                  onDelete={handleDelete}
                  onEditItemChange={handleEditItemChange}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))
            ) : (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No accomplishments added yet. Add your first one to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccomplishmentsManagement;
