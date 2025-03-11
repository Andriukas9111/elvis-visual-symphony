
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MainContentForm from './about/sections/MainContentForm';
import SocialStatsForm from './about/sections/SocialStatsForm';
import AccomplishmentsForm from './about/sections/AccomplishmentsForm';
import { Separator } from '@/components/ui/separator';

const AboutContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">About Me Content</h2>
        <p className="text-muted-foreground">
          Manage all content displayed in the About section of your website.
        </p>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
              <TabsTrigger value="main">Main Content</TabsTrigger>
              <TabsTrigger value="stats">Social Stats</TabsTrigger>
              <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="space-y-4">
              <MainContentForm />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <SocialStatsForm />
            </TabsContent>
            
            <TabsContent value="accomplishments" className="space-y-4">
              <AccomplishmentsForm />
            </TabsContent>
            
            <TabsContent value="expertise" className="space-y-4">
              <p className="text-center py-4">Expertise section editor will be implemented in the next phase.</p>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <p className="text-center py-4">Social links editor will be implemented in the next phase.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContentEditor;
