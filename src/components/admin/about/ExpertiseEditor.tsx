
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpertise } from '@/hooks/api/useExpertise';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ExpertiseList from './expertise/ExpertiseList';
import ProjectsList from './expertise/ProjectsList';
import ExpertiseForm from './expertise/ExpertiseForm';
import { iconOptions } from './stats/IconSelector';
import AdminLoadingState from '../AdminLoadingState';

const ExpertiseEditor: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("expertise");
  
  // Fetch expertise and project types data
  const { 
    data: expertiseData, 
    isLoading: isExpertiseLoading, 
    error: expertiseError 
  } = useExpertise('expertise');
  
  const { 
    data: projectsData, 
    isLoading: isProjectsLoading, 
    error: projectsError 
  } = useExpertise('project');
  
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
        ? (expertiseData?.length || 0) 
        : (projectsData?.length || 0)
    });
    setShowForm(true);
  };
  
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  
  const handleSave = (item: any) => {
    // Save logic will be implemented in the form component
    setShowForm(false);
    setEditingItem(null);
  };
  
  const handleDelete = (id: string) => {
    // Delete logic will be implemented in the list components
    if (confirm(`Are you sure you want to delete this ${activeTab === 'expertise' ? 'expertise area' : 'project type'}?`)) {
      // Delete logic
    }
  };
  
  if (isExpertiseLoading || isProjectsLoading) {
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
                expertise={expertiseData || []}
                isLoading={isExpertiseLoading}
                error={expertiseError}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="project">
              <ProjectsList
                projects={projectsData || []}
                isLoading={isProjectsLoading}
                error={projectsError}
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
