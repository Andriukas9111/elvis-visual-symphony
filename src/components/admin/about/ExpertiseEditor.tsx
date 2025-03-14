
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpertise, useCreateExpertise, useUpdateExpertise, useDeleteExpertise } from '@/hooks/api/useExpertise';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ExpertiseList from './expertise/ExpertiseList';
import ProjectsList from './expertise/ProjectsList';
import ExpertiseForm from './expertise/ExpertiseForm';
import { iconOptions } from './stats/IconSelector';
import AdminLoadingState from '../AdminLoadingState';
import { ExpertiseItem } from '@/hooks/api/useExpertise';

const ExpertiseEditor: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("expertise");
  
  // Fetch expertise and project types data
  const { 
    data: expertiseData, 
    isLoading: isExpertiseLoading, 
    error: expertiseError 
  } = useExpertise();
  
  const createExpertise = useCreateExpertise();
  const updateExpertise = useUpdateExpertise();
  const deleteExpertise = useDeleteExpertise();
  
  const expertiseItems = expertiseData?.filter(item => item.type === 'expertise') || [];
  const projectItems = expertiseData?.filter(item => item.type === 'project') || [];
  
  // State for adding/editing forms
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const handleAddNew = () => {
    setEditingItem({
      label: '',
      description: '',
      icon_name: 'Camera',
      type: activeTab,
      sort_order: activeTab === 'expertise' 
        ? (expertiseItems.length || 0) 
        : (projectItems.length || 0)
    });
    setShowForm(true);
  };
  
  const handleEdit = (item: ExpertiseItem) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  
  const handleSave = async (item: ExpertiseItem) => {
    try {
      if (item.id) {
        // Update existing item
        await updateExpertise.mutateAsync({
          id: item.id,
          type: item.type,
          updates: {
            label: item.label,
            description: item.description,
            icon_name: item.icon_name,
            background_color: item.background_color,
            sort_order: item.sort_order
          }
        });
        toast({ title: "Success", description: `${item.type === 'expertise' ? 'Expertise' : 'Project type'} updated successfully` });
      } else {
        // Create new item
        await createExpertise.mutateAsync(item);
        toast({ title: "Success", description: `${item.type === 'expertise' ? 'Expertise' : 'Project type'} created successfully` });
      }
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      toast({ 
        title: "Error", 
        description: `Failed to save ${item.type === 'expertise' ? 'expertise' : 'project type'}`,
        variant: "destructive" 
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      // Determine the item type for proper UI messaging
      const itemType = expertiseItems.find(item => item.id === id) 
        ? 'expertise' 
        : 'project';
      
      if (confirm(`Are you sure you want to delete this ${itemType === 'expertise' ? 'expertise area' : 'project type'}?`)) {
        await deleteExpertise.mutateAsync({ id, type: itemType as 'expertise' | 'project' });
        toast({ 
          title: "Success", 
          description: `${itemType === 'expertise' ? 'Expertise' : 'Project type'} deleted successfully` 
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete item",
        variant: "destructive" 
      });
    }
  };
  
  if (isExpertiseLoading) {
    return <AdminLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="expertise">Expertise Areas</TabsTrigger>
          <TabsTrigger value="project">Project Types</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === 'expertise' ? 'Expertise Areas' : 'Project Types'}
          </h2>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add {activeTab === 'expertise' ? 'Expertise' : 'Project Type'}
          </Button>
        </div>
        
        {showForm ? (
          <ExpertiseForm
            item={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
            isNew={!editingItem.id}
            iconOptions={iconOptions}
          />
        ) : (
          <>
            <TabsContent value="expertise">
              <ExpertiseList
                expertise={expertiseItems}
                isLoading={isExpertiseLoading}
                error={expertiseError}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="project">
              <ProjectsList
                projects={projectItems}
                isLoading={isExpertiseLoading}
                error={expertiseError}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ExpertiseEditor;
