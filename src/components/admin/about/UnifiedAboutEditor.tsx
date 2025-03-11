
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutContentEditor from './AboutContentEditor';
import ExpertiseEditor from './ExpertiseEditor';
import StatsEditor from './StatsEditor';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import SocialEditor from './SocialEditor';
import AccomplishmentsEditor from './AccomplishmentsEditor';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const UnifiedAboutEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [error, setError] = useState<Error | null>(null);
  
  // Error boundary using try/catch
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('Caught error in UnifiedAboutEditor:', e.error);
      setError(e.error);
    };
    
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'content':
          return <AboutContentEditor />;
        case 'stats':
          return <StatsEditor />;
        case 'expertise':
          return <ExpertiseEditor />;
        case 'skills':
          return <TechnicalSkillsEditor />;
        case 'accomplishments':
          return <AccomplishmentsEditor />;
        case 'testimonials':
          return <TestimonialsEditor />;
        case 'social':
          return <SocialEditor />;
        default:
          return <AboutContentEditor />;
      }
    } catch (err) {
      console.error('Error rendering tab content:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };
  
  const clearError = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-md p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-300">Error in About Editor</h3>
            <p className="text-sm text-white/70 mt-1">An error occurred while loading the about editor component.</p>
          </div>
        </div>
        
        <div className="bg-black/30 p-4 rounded border border-white/10 font-mono text-sm whitespace-pre-wrap text-white/80">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </div>
        
        <Button onClick={clearError} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }
  
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
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
};

export default UnifiedAboutEditor;
