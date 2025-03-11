
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MainContentForm from './about/sections/MainContentForm';
import SocialStatsForm from './about/sections/social-stats';
import AccomplishmentsForm from './about/sections/AccomplishmentsForm';
import FeaturedProjectsForm from './about/sections/FeaturedProjectsForm';
import SocialLinksForm from './about/sections/SocialLinksForm';
import ExpertiseItemsForm from './about/sections/ExpertiseItemsForm';
import ProjectTypesForm from './about/sections/ProjectTypesForm';
import TechnicalSkillsForm from './about/sections/TechnicalSkillsForm';
import TestimonialsForm from './about/sections/TestimonialsForm';
import { Separator } from '@/components/ui/separator';

const AboutContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">About Me Content</h2>
        <p className="text-muted-foreground">
          Manage all content displayed in the About section of your website.
        </p>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-8">
              <TabsTrigger value="main">Main Content</TabsTrigger>
              <TabsTrigger value="stats">Social Stats</TabsTrigger>
              <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="project-types">Project Types</TabsTrigger>
              <TabsTrigger value="skills">Technical Skills</TabsTrigger>
              <TabsTrigger value="featured">Featured Projects</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="space-y-4">
              <MainContentForm />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <SocialStatsForm />
            </TabsContent>
            
            <TabsContent value="accomplishments" className="space-y-4">
              <AccomplishmentsForm />
            </TabsContent>
            
            <TabsContent value="expertise" className="space-y-4">
              <ExpertiseItemsForm />
            </TabsContent>
            
            <TabsContent value="project-types" className="space-y-4">
              <ProjectTypesForm />
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4">
              <TechnicalSkillsForm />
            </TabsContent>
            
            <TabsContent value="featured" className="space-y-4">
              <FeaturedProjectsForm />
            </TabsContent>
            
            <TabsContent value="testimonials" className="space-y-4">
              <TestimonialsForm />
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <SocialLinksForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContentEditor;
