
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutContentEditor from './AboutContentEditor';
import ExpertiseEditor from './ExpertiseEditor';
import StatsEditor from './StatsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import SocialEditor from './SocialEditor';
import { ErrorBoundary } from '../ErrorBoundary';
import { logError } from '@/utils/errorLogger';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">About Page Editor</h1>
          <p className="text-muted-foreground">
            Manage content specific to the About page section of your website.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin?tab=home" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home Editor</span>
          </Link>
        </Button>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Notice: Some sections moved</AlertTitle>
        <AlertDescription>
          Key Accomplishments, Social Statistics, and Expertise sections are now managed in the Home Page Editor for better organization.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="content">My Story</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <div className="min-h-[400px]">
          <TabsContent value="content">
            {renderComponent(AboutContentEditor, 'AboutContentEditor')}
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
