
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutContentEditor from './AboutContentEditor';
import ExpertiseEditor from './ExpertiseEditor';
import StatsEditor from './StatsEditor';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';
import TestimonialsEditor from './TestimonialsEditor';

const UnifiedAboutEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">About Page Editor</h1>
        <p className="text-muted-foreground">
          Manage all content displayed on the About section of your website.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="content">My Story</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="expertise">Expertise & Projects</TabsTrigger>
          <TabsTrigger value="skills">Technical Skills</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <AboutContentEditor />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <StatsEditor />
        </TabsContent>
        
        <TabsContent value="expertise" className="space-y-6">
          <ExpertiseEditor />
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6">
          <TechnicalSkillsEditor />
        </TabsContent>
        
        <TabsContent value="testimonials" className="space-y-6">
          <TestimonialsEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAboutEditor;
