
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { logError } from '@/utils/errorLogger';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  
  const navigateTo = (section: string) => {
    navigate(`/admin?tab=${section}`);
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
        <AlertTitle>Centralized Content Management</AlertTitle>
        <AlertDescription>
          Choose a section below to edit specific content areas of your website.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Edit the main hero section of your home page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure your homepage headline, subheadline, and call-to-action buttons.
                </p>
                <Button onClick={() => navigateTo('home')} className="w-full">
                  Edit Hero Section
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Featured Projects</CardTitle>
                <CardDescription>
                  Manage your portfolio of featured work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Choose which projects to showcase on your homepage.
                </p>
                <Button onClick={() => navigateTo('home')} className="w-full">
                  Edit Featured Projects
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Services Section</CardTitle>
                <CardDescription>
                  Update the services you offer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Edit your services, descriptions, and associated images.
                </p>
                <Button onClick={() => navigateTo('home')} className="w-full">
                  Edit Services
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Equipment Showcase</CardTitle>
                <CardDescription>
                  Feature your professional equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage the equipment section to showcase your professional gear.
                </p>
                <Button onClick={() => navigateTo('home')} className="w-full">
                  Edit Equipment Showcase
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
                <CardDescription>
                  Tell your story and background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Edit your personal story, mission statement, and philosophy.
                </p>
                <Button onClick={() => navigateTo('about')} className="w-full">
                  Edit About Content
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Expertise Areas</CardTitle>
                <CardDescription>
                  Showcase your areas of expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage the specific areas you specialize in with related projects.
                </p>
                <Button onClick={() => navigateTo('about')} className="w-full">
                  Edit Expertise Areas
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>
                  Showcase client testimonials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage client testimonials and feedback to display on your about page.
                </p>
                <Button onClick={() => navigateTo('about')} className="w-full">
                  Edit Testimonials
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>
                  Showcase your technical abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your technical skills and proficiency levels.
                </p>
                <Button onClick={() => navigateTo('about')} className="w-full">
                  Edit Technical Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="blog">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>
                  Create and edit blog content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your blog posts, including creating new ones and editing existing content.
                </p>
                <Button onClick={() => navigateTo('blog')} className="w-full">
                  Edit Blog Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>
                  Manage your images and videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Upload, organize, and manage all your media files used across the website.
                </p>
                <Button onClick={() => navigateTo('media')} className="w-full">
                  Open Media Library
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
