
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useExpertise } from '@/hooks/api/useExpertise';
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

  // Filter items by type
  const expertiseData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'expertise');
  }, [expertiseItems]);
  
  const projectData = React.useMemo(() => {
    if (!expertiseItems) return [];
    return expertiseItems.filter(item => item.type === 'project');
  }, [expertiseItems]);

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
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectsList 
          projects={projectData}
          isLoading={isLoading}
          error={error}
          onEdit={setEditingItem}
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
