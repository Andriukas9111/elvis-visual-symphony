
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useExpertise, useCreateExpertise, useUpdateExpertise, useDeleteExpertise } from '@/hooks/api/useExpertise';
import ExpertiseList from './expertise/ExpertiseList';
import ProjectsList from './expertise/ProjectsList';
import ExpertiseForm from './expertise/ExpertiseForm';
import { iconOptions } from './stats/IconSelector';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';

const ExpertiseEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expertise');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { data: expertiseItems, isLoading, error } = useExpertise();
  const createExpertise = useCreateExpertise();
  const updateExpertise = useUpdateExpertise();
  const deleteExpertise = useDeleteExpertise();

  // Filter items by type
  const expertiseData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'expertise');
  }, [expertiseItems]);
  
  const projectData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'project');
  }, [expertiseItems]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingItem({
      id: '',
      type: activeTab === 'expertise' ? 'expertise' : 'project',
      label: '',
      description: '',
      icon_name: 'Camera',
      sort_order: 0
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteExpertise.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (isAddingNew) {
        await createExpertise.mutateAsync(formData);
      } else {
        await updateExpertise.mutateAsync({
          id: formData.id,
          updates: formData
        });
      }
      setEditingItem(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
  };

  if (editingItem || isAddingNew) {
    return (
      <ExpertiseForm 
        item={editingItem!}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isAddingNew}
        iconOptions={iconOptions}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="expertise">Expertise Areas</TabsTrigger>
          <TabsTrigger value="projects">Project Types</TabsTrigger>
          <TabsTrigger value="skills">Technical Skills</TabsTrigger>
        </TabsList>
        
        {activeTab !== 'skills' && (
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add {activeTab === 'expertise' ? 'Expertise' : 'Project Type'}
          </Button>
        )}
      </div>
      
      <TabsContent value="expertise">
        <ExpertiseList 
          expertise={expertiseData} 
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectsList 
          projects={projectData}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TabsContent>
      
      <TabsContent value="skills">
        <TechnicalSkillsEditor />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertiseEditor;
