
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useExpertise } from '@/hooks/api/useExpertise';
import { useExpertiseActions } from '@/hooks/admin/useExpertiseActions';
import ExpertiseList from './expertise/ExpertiseList';
import ProjectsList from './expertise/ProjectsList';
import ExpertiseForm from './expertise/ExpertiseForm';
import { iconOptions } from './stats/IconSelector';

const ExpertiseEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expertise');

  const { data: expertiseItems, isLoading, error } = useExpertise();
  const {
    editingItem,
    isAddingNew,
    handleAddNew,
    handleEdit,
    handleCancel,
    handleDelete,
    handleSave
  } = useExpertiseActions();

  // Filter items by type
  const expertiseData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'expertise');
  }, [expertiseItems]);
  
  const projectData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'project');
  }, [expertiseItems]);

  const handleAddNewClick = () => {
    handleAddNew(activeTab === 'expertise' ? 'expertise' : 'project');
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
        </TabsList>
        
        <Button onClick={handleAddNewClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add {activeTab === 'expertise' ? 'Expertise' : 'Project Type'}
        </Button>
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
    </Tabs>
  );
};

export default ExpertiseEditor;
