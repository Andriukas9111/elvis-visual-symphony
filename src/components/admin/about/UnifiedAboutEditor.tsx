
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AboutContentEditor from './AboutContentEditor';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import ExpertiseEditor from './ExpertiseEditor';
import StatsEditor from './StatsEditor';

const UnifiedAboutEditor = () => {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>About Section Management</CardTitle>
        <CardDescription>Manage all content displayed in the About section of your website</CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="content">About Content</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="skills">Technical Skills</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="content">
            <AboutContentEditor />
          </TabsContent>
          
          <TabsContent value="expertise">
            <ExpertiseEditor />
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsEditor />
          </TabsContent>
          
          <TabsContent value="skills">
            <TechnicalSkillsEditor />
          </TabsContent>
          
          <TabsContent value="testimonials">
            <TestimonialsEditor />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Changes are automatically saved to the database
        </p>
        <Button variant="outline" onClick={() => window.open('/#about', '_blank')}>
          Preview in Home Page
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnifiedAboutEditor;
