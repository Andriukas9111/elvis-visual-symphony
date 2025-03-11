
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ExpertiseTabContent from './expertise/ExpertiseTabContent';
import ProjectTypesTabContent from './expertise/ProjectTypesTabContent';
import TechnicalSkillsTabContent from './expertise/TechnicalSkillsTabContent';

const ExpertiseEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("expertise");
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">My Expertise</h2>
        <p className="text-muted-foreground">
          Manage all expertise-related content shown in the About section.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md">
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="projects">Project Types</TabsTrigger>
          <TabsTrigger value="skills">Technical Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expertise">
          <ExpertiseTabContent />
        </TabsContent>
        
        <TabsContent value="projects">
          <ProjectTypesTabContent />
        </TabsContent>
        
        <TabsContent value="skills">
          <TechnicalSkillsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpertiseEditor;
