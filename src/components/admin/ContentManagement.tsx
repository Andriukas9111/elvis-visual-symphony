
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { logError } from '@/utils/errorLogger';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Home Page</CardTitle>
            <CardDescription>
              Edit all sections of your home page including hero, featured projects, services and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage hero content, about section snippet, featured projects, equipment showcase, 
              services section, and contact form.
            </p>
            <Button onClick={() => navigateTo('home')} className="w-full">
              Edit Home Page
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>About Page</CardTitle>
            <CardDescription>
              Edit your about page content including your story, expertise, testimonials and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your personal story, expertise areas, statistics, technical skills, 
              testimonials, and social media profiles.
            </p>
            <Button onClick={() => navigateTo('about')} className="w-full">
              Edit About Page
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Blog</CardTitle>
            <CardDescription>
              Create and edit blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your blog content, create new posts, edit existing posts, and organize categories.
            </p>
            <Button onClick={() => navigateTo('blog')} className="w-full">
              Edit Blog
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>
              Manage all your media files including images and videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload, organize, and manage all your media assets that are used across the website.
            </p>
            <Button onClick={() => navigateTo('media')} className="w-full">
              Open Media Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentManagement;
