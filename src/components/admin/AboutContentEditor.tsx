
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import MainContentEditor from './about/MainContentEditor';
import SocialStatsEditor from './about/SocialStatsEditor';
import AccomplishmentsEditor from './about/AccomplishmentsEditor';
import ExpertiseEditor from './about/ExpertiseEditor';
import SocialLinksEditor from './about/SocialLinksEditor';
import FeaturedProjectsEditor from './about/FeaturedProjectsEditor';
import TestimonialsEditor from './about/TestimonialsEditor';
import SectionSettingsEditor from './about/SectionSettingsEditor';

const AboutContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("main");
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">About Me Content</h2>
        <p className="text-muted-foreground">
          Manage all content displayed in the About section of your website.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="main">Main</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main">
              <MainContentEditor />
            </TabsContent>
            
            <TabsContent value="stats">
              <SocialStatsEditor />
            </TabsContent>
            
            <TabsContent value="accomplishments">
              <AccomplishmentsEditor />
            </TabsContent>
            
            <TabsContent value="expertise">
              <ExpertiseEditor />
            </TabsContent>
            
            <TabsContent value="social">
              <SocialLinksEditor />
            </TabsContent>
            
            <TabsContent value="projects">
              <FeaturedProjectsEditor />
            </TabsContent>
            
            <TabsContent value="testimonials">
              <TestimonialsEditor />
            </TabsContent>
            
            <TabsContent value="settings">
              <SectionSettingsEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContentEditor;
