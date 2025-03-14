
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HeroEditor from './content/HeroEditor';
import AboutEditor from './content/AboutEditor';
import FeaturedEditor from './content/FeaturedEditor';
import ServicesEditor from './content/ServicesEditor';
import EquipmentEditor from './content/EquipmentEditor';
import ContactEditor from './content/ContactEditor';
import FooterEditor from './content/FooterEditor';
import ScrollIndicatorEditor from './content/ScrollIndicatorEditor';
import ExpertiseEditor from './about/ExpertiseEditor';
import StatsEditor from './about/StatsEditor';
import SocialStatisticsEditor from './about/SocialStatisticsEditor';
import AccomplishmentsEditor from './about/AccomplishmentsEditor';
import TestimonialsEditor from './about/TestimonialsEditor';
import SocialEditor from './about/SocialEditor';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { logError } from '@/utils/errorLogger';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeHomeTab, setActiveHomeTab] = useState('hero');
  const [activeAboutTab, setActiveAboutTab] = useState('content');
  
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
        <h1 className="text-2xl font-bold mb-2">Content Management</h1>
        <p className="text-muted-foreground">
          Manage all content displayed on your website.
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
          <CardTitle>Website Content Sections</CardTitle>
          <CardDescription>
            Edit content for each section of your website
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex flex-wrap justify-start">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Section</TabsTrigger>
            </TabsList>
            
            <div className="min-h-[400px]">
              <TabsContent value="home">
                <Tabs value={activeHomeTab} onValueChange={setActiveHomeTab}>
                  <TabsList className="mb-6 flex flex-wrap justify-start">
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    <TabsTrigger value="scroll">Scroll Indicator</TabsTrigger>
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
              </TabsContent>
              
              <TabsContent value="about">
                <Tabs value={activeAboutTab} onValueChange={setActiveAboutTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="content">My Story</TabsTrigger>
                    <TabsTrigger value="social-stats">Social Stats</TabsTrigger>
                    <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
                    <TabsTrigger value="expertise-skills">Expertise & Skills</TabsTrigger>
                    <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                  </TabsList>
                  
                  <div className="min-h-[400px]">
                    <TabsContent value="content">
                      {renderComponent(AboutEditor, 'AboutContentEditor')}
                    </TabsContent>
                    
                    <TabsContent value="social-stats">
                      {renderComponent(SocialStatisticsEditor, 'SocialStatisticsEditor')}
                    </TabsContent>
                    
                    <TabsContent value="accomplishments">
                      {renderComponent(AccomplishmentsEditor, 'AccomplishmentsEditor')}
                    </TabsContent>
                    
                    <TabsContent value="expertise-skills">
                      {renderComponent(ExpertiseEditor, 'ExpertiseEditor')}
                    </TabsContent>
                    
                    <TabsContent value="testimonials">
                      {renderComponent(TestimonialsEditor, 'TestimonialsEditor')}
                    </TabsContent>
                    
                    <TabsContent value="social">
                      {renderComponent(SocialEditor, 'SocialEditor')}
                    </TabsContent>
                  </div>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
