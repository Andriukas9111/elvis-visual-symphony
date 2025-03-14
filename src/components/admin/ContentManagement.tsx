
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ExternalLink } from 'lucide-react';
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
        <AlertTitle>Content Organization Update</AlertTitle>
        <AlertDescription>
          We've reorganized content management for a more intuitive experience. Home Page Editor now includes About section, Accomplishments, and Expertise management.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home & About Content</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Home Page Sections</CardTitle>
                <CardDescription>
                  Manage all content displayed on your home page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Edit your hero section, featured projects, services, expertise, and other home page content.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Hero Section</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Social Statistics</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Key Accomplishments</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Expertise & Projects</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button onClick={() => navigateTo('home')} className="w-full">
                    Open Home Page Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>About Page Sections</CardTitle>
                <CardDescription>
                  Manage content specific to your about page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Edit testimonials and other content specific to your about page.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>My Story</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Testimonials</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <span>Social Media Links</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Button onClick={() => navigateTo('about')} className="w-full">
                    Open About Page Editor
                  </Button>
                </div>
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
