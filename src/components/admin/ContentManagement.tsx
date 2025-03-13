
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HeroEditor from './content/HeroEditor';
import AboutEditor from './content/AboutEditor';
import FeaturedEditor from './content/FeaturedEditor';
import ServicesEditor from './content/ServicesEditor';
import EquipmentEditor from './content/EquipmentEditor';
import ContactEditor from './content/ContactEditor';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Home Page Content Editor</h1>
        <p className="text-muted-foreground">
          Manage all content displayed on your homepage.
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content is live</AlertTitle>
        <AlertDescription>
          Changes you make here will be immediately visible on your site after saving.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Home Page Sections</CardTitle>
          <CardDescription>
            Edit content for each section of your homepage
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex flex-wrap justify-start">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="about">About Section</TabsTrigger>
              <TabsTrigger value="featured">Featured Projects</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            
            <div className="min-h-[400px]">
              <TabsContent value="hero">
                <HeroEditor />
              </TabsContent>
              
              <TabsContent value="about">
                <AboutEditor />
              </TabsContent>
              
              <TabsContent value="featured">
                <FeaturedEditor />
              </TabsContent>
              
              <TabsContent value="equipment">
                <EquipmentEditor />
              </TabsContent>
              
              <TabsContent value="services">
                <ServicesEditor />
              </TabsContent>
              
              <TabsContent value="contact">
                <ContactEditor />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
