
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Info, 
  Loader2, 
  Home, 
  Palette, 
  Type, 
  ImageIcon, 
  Camera, 
  Layout, 
  MessageSquare, 
  Newspaper, 
  HeartHandshake, 
  ChevronRight, 
  Award,
  Briefcase
} from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import HeroEditor from '../content/HeroEditor';
import ScrollIndicatorEditor from '../content/ScrollIndicatorEditor';
import AboutEditor from '../content/AboutEditor';
import FeaturedEditor from '../content/FeaturedEditor';
import ServicesEditor from '../content/ServicesEditor';
import EquipmentEditor from '../content/EquipmentEditor';
import SocialStatisticsEditor from './SocialStatisticsEditor';
import FooterEditor from '../content/FooterEditor';
import ContactEditor from '../content/ContactEditor';
import { useAllContent } from '@/hooks/api/useContent';
import { SectionHeader } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AccomplishmentsEditor from '../about/AccomplishmentsEditor';
import ExpertiseEditor from '../about/ExpertiseEditor';

// Tabs configuration for more semantic organization
const tabs = [
  {
    id: 'hero',
    label: 'Hero Section',
    icon: <Home className="h-4 w-4 mr-2" />,
    component: HeroEditor,
    description: 'Configure the main hero section that visitors see first'
  },
  {
    id: 'scroll',
    label: 'Scroll Indicator',
    icon: <Layout className="h-4 w-4 mr-2" />,
    component: ScrollIndicatorEditor,
    description: 'Set up the scroll indicator in the hero section'
  },
  {
    id: 'social-stats',
    label: 'Social Statistics',
    icon: <Newspaper className="h-4 w-4 mr-2" />,
    component: SocialStatisticsEditor,
    description: 'Display your social media statistics and followers'
  },
  {
    id: 'about',
    label: 'About Section',
    icon: <Info className="h-4 w-4 mr-2" />,
    component: AboutEditor,
    description: 'Edit the about section information'
  },
  {
    id: 'accomplishments',
    label: 'Key Accomplishments',
    icon: <Award className="h-4 w-4 mr-2" />,
    component: AccomplishmentsEditor,
    description: 'Showcase your major achievements and milestones'
  },
  {
    id: 'expertise',
    label: 'My Expertise',
    icon: <Briefcase className="h-4 w-4 mr-2" />,
    component: ExpertiseEditor,
    description: 'Highlight your areas of expertise and project types'
  },
  {
    id: 'featured',
    label: 'Featured Projects',
    icon: <ImageIcon className="h-4 w-4 mr-2" />,
    component: FeaturedEditor,
    description: 'Manage your portfolio of featured work'
  },
  {
    id: 'equipment',
    label: 'Equipment',
    icon: <Camera className="h-4 w-4 mr-2" />,
    component: EquipmentEditor,
    description: 'Showcase the equipment you use'
  },
  {
    id: 'services',
    label: 'Services',
    icon: <HeartHandshake className="h-4 w-4 mr-2" />,
    component: ServicesEditor,
    description: 'Edit the services you offer'
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <MessageSquare className="h-4 w-4 mr-2" />,
    component: ContactEditor,
    description: 'Update your contact section'
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: <Type className="h-4 w-4 mr-2" />,
    component: FooterEditor,
    description: 'Edit the footer content and links'
  }
];

const HomePageEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { isLoading, data } = useAllContent();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add horizontal scroll to tabs with arrow keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tabsContainerRef.current) return;
      
      if (e.key === 'ArrowRight') {
        tabsContainerRef.current.scrollLeft += 100;
      } else if (e.key === 'ArrowLeft') {
        tabsContainerRef.current.scrollLeft -= 100;
      }
    };
    
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      tabsContainer.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (tabsContainer) {
        tabsContainer.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    // Wait for state update before scrolling
    setTimeout(() => {
      const contentArea = document.getElementById('tab-content-area');
      if (contentArea) {
        // Use a smoother scroll to element with offset for navbar
        window.scrollTo({
          top: contentArea.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
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
  
  // Get the active tab's description
  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  
  return (
    <div className="space-y-6">
      <div>
        <SectionHeader>Home Page Editor</SectionHeader>
        <p className="text-muted-foreground mt-2">
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
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2 text-elvis-pink" />
            <span>Home Page Sections</span>
          </CardTitle>
          <CardDescription>
            Edit content for each section of your homepage
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-4" ref={tabsContainerRef}>
              {/* Single scrollable row of tabs */}
              <TabsList className="flex flex-nowrap mb-6 min-w-max">
                {tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      "flex items-center whitespace-nowrap m-1",
                      activeTab === tab.id ? "text-white bg-elvis-pink" : ""
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {activeTabConfig && (
              <div className="mb-6">
                <h3 className="text-lg font-medium">{activeTabConfig.label}</h3>
                <p className="text-muted-foreground text-sm">{activeTabConfig.description}</p>
              </div>
            )}
            
            <div id="tab-content-area" className="min-h-[400px]">
              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id}>
                  {renderComponent(tab.component, `${tab.id}Editor`)}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageEditor;
