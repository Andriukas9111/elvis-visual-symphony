
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutContentEditor from './AboutContentEditor';
import ExpertiseEditor from './ExpertiseEditor';
import StatsEditor from './StatsEditor';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import SocialEditor from './SocialEditor';
import AccomplishmentsManagement from './AccomplishmentsManagement';
import ErrorBoundary from '../ErrorBoundary';
import { logError } from '@/utils/errorLogger';

const UnifiedAboutEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Wrapped component rendering with error handling
  const renderComponent = (Component: React.ComponentType, name: string) => {
    try {
      return (
        <ErrorBoundary componentName={name}>
          <Component />
        </ErrorBoundary>
      );
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        context: `admin:${name}`,
      });
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-md">
          <p className="text-red-300">Error loading {name} component</p>
        </div>
      );
    }
  };
  
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
          <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[400px]">
          <TabsContent value="content">
            {renderComponent(AboutContentEditor, 'AboutContentEditor')}
          </TabsContent>
          
          <TabsContent value="stats">
            {renderComponent(StatsEditor, 'StatsEditor')}
          </TabsContent>
          
          <TabsContent value="expertise">
            {renderComponent(ExpertiseEditor, 'ExpertiseEditor')}
          </TabsContent>
          
          <TabsContent value="skills">
            {renderComponent(TechnicalSkillsEditor, 'TechnicalSkillsEditor')}
          </TabsContent>
          
          <TabsContent value="accomplishments">
            {renderComponent(AccomplishmentsManagement, 'AccomplishmentsManagement')}
          </TabsContent>
          
          <TabsContent value="testimonials">
            {renderComponent(TestimonialsEditor, 'TestimonialsEditor')}
          </TabsContent>
          
          <TabsContent value="social">
            {renderComponent(SocialEditor, 'SocialEditor')}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UnifiedAboutEditor;
