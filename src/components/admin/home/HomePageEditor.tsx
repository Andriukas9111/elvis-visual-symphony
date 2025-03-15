
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

const tabGroups = [
  {
    category: "Header & Landing",
    tabs: [
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
      }
    ]
  },
  {
    category: "About & Profile",
    tabs: [
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
        id: 'social-stats',
        label: 'Social Statistics',
        icon: <Newspaper className="h-4 w-4 mr-2" />,
        component: SocialStatisticsEditor,
        description: 'Display your social media statistics and followers'
      }
    ]
  },
  {
    category: "Portfolio & Services",
    tabs: [
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
      }
    ]
  },
  {
    category: "Contact & Footer",
    tabs: [
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
    ]
  }
];

const allTabs = tabGroups.flatMap(group => group.tabs);

const HomePageEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { isLoading, data } = useAllContent();
  const contentAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeTab]);
  
  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
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
  
  const activeTabConfig = allTabs.find(tab => tab.id === activeTab);
  
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {tabGroups.map((group) => (
                <div key={group.category} className="space-y-3">
                  <h3 className="text-sm font-medium text-elvis-pink/90 border-b border-elvis-pink/20 pb-1 mb-2">
                    {group.category}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {group.tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className={cn(
                          "flex items-center justify-start text-left h-auto py-2.5 px-3",
                          activeTab === tab.id 
                            ? "bg-elvis-pink text-white" 
                            : "hover:bg-elvis-dark/40 hover:text-white"
                        )}
                        onClick={(e) => handleTabClick(tab.id, e)}
                      >
                        <span className="flex items-center">
                          {tab.icon}
                          <span className="ml-2">{tab.label}</span>
                        </span>
                        {activeTab === tab.id && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {activeTabConfig && (
              <div className="mb-6">
                <h3 className="text-lg font-medium">{activeTabConfig.label}</h3>
                <p className="text-muted-foreground text-sm">{activeTabConfig.description}</p>
              </div>
            )}
            
            <div id="tab-content-area" ref={contentAreaRef} className="pt-4 border-t border-elvis-pink/10">
              {allTabs.map(tab => (
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
