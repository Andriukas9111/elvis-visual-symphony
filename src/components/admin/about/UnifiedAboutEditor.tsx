
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAboutSections } from '@/hooks/api/useAboutSection';
import { useExpertise } from '@/hooks/api/useExpertise';
import { useSkills } from '@/hooks/api/useSkills';
import { useTestimonials } from '@/hooks/api/useTestimonials';

const UnifiedAboutEditor = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const { data: aboutSections, isLoading: sectionsLoading } = useAboutSections();
  const { data: expertise, isLoading: expertiseLoading } = useExpertise();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">About Section Editor</CardTitle>
        <CardDescription>
          Manage all content displayed in the About section of your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Content</CardTitle>
                <CardDescription>Edit the main about section content</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement about content editor */}
                <p className="text-muted-foreground">General about section editor coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expertise" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expertise Management</CardTitle>
                <CardDescription>Manage your expertise and services</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement expertise editor */}
                <p className="text-muted-foreground">Expertise management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills Management</CardTitle>
                <CardDescription>Manage your technical and professional skills</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement skills editor */}
                <p className="text-muted-foreground">Skills management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistics Management</CardTitle>
                <CardDescription>Manage statistics and numbers displayed in your about section</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement statistics editor */}
                <p className="text-muted-foreground">Statistics management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Management</CardTitle>
                <CardDescription>Manage client testimonials and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement testimonials editor */}
                <p className="text-muted-foreground">Testimonials management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Management</CardTitle>
                <CardDescription>Manage social media profiles and links</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Todo: Implement social media editor */}
                <p className="text-muted-foreground">Social media management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedAboutEditor;
