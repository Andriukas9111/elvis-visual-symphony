
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import HeroEditor from '../content/HeroEditor';
import ScrollIndicatorEditor from '../content/ScrollIndicatorEditor';
import AboutEditor from '../content/AboutEditor';
import FeaturedEditor from '../content/FeaturedEditor';
import ServicesEditor from '../content/ServicesEditor';
import EquipmentEditor from '../content/EquipmentEditor';
import SocialStatisticsEditor from '../home/SocialStatisticsEditor';
import FooterEditor from '../content/FooterEditor';
import ContactEditor from '../content/ContactEditor';
import { useAllContent } from '@/hooks/api/useContent';

const HomePageEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { isLoading } = useAllContent();
  
  const renderComponent = (Component: React.ComponentType, name: string) => {
    try {
      return (
        <ErrorBoundary componentName={name}>
          <Component />
        </ErrorBoundary>
      );
    } catch (error) {
      console.error(`Error rendering ${name}:`, error);
      return (
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-md">
          <p className="text-red-300">Error loading {name} component</p>
        </div>
      );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading homepage settings...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Home Page Editor</h1>
        <p className="text-muted-foreground">
          Manage all content displayed on your homepage. Changes are saved per section.
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content is live</AlertTitle>
        <AlertDescription>
          Changes you make here will be immediately visible on your site after saving each section.
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
            <TabsList className="mb-6 flex flex-wrap justify-start gap-1">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="scroll">Scroll Indicator</TabsTrigger>
              <TabsTrigger value="social-stats">Social Statistics</TabsTrigger>
              <TabsTrigger value="about">About Section</TabsTrigger>
              <TabsTrigger value="featured">Featured Projects</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>
            
            <div className="min-h-[400px]">
              <TabsContent value="hero">
                {renderComponent(HeroEditor, 'HeroEditor')}
              </TabsContent>
              
              <TabsContent value="scroll">
                {renderComponent(ScrollIndicatorEditor, 'ScrollIndicatorEditor')}
              </TabsContent>
              
              <TabsContent value="social-stats">
                {renderComponent(SocialStatisticsEditor, 'SocialStatisticsEditor')}
              </TabsContent>
              
              <TabsContent value="about">
                {renderComponent(AboutEditor, 'AboutEditor')}
              </TabsContent>
              
              <TabsContent value="featured">
                {renderComponent(FeaturedEditor, 'FeaturedEditor')}
              </TabsContent>
              
              <TabsContent value="equipment">
                {renderComponent(EquipmentEditor, 'EquipmentEditor')}
              </TabsContent>
              
              <TabsContent value="services">
                {renderComponent(ServicesEditor, 'ServicesEditor')}
              </TabsContent>
              
              <TabsContent value="contact">
                {renderComponent(ContactEditor, 'ContactEditor')}
              </TabsContent>
              
              <TabsContent value="footer">
                {renderComponent(FooterEditor, 'FooterEditor')}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageEditor;
