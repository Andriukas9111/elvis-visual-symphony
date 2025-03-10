
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialMediaEditor from './social/SocialMediaEditor';
import { useToast } from '@/components/ui/use-toast';
import { useContent, useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const SocialEditor: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('links');
  const { data: socialData, isLoading } = useContent('social');
  const createContentMutation = useCreateContent();
  const updateContentMutation = useUpdateContent();
  
  const [contactEmail, setContactEmail] = useState('');
  const [hireButtonText, setHireButtonText] = useState('Hire Me');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract contact email and button text from content data
  useEffect(() => {
    if (socialData && socialData.length > 0) {
      const emailData = socialData.find(item => item.title === 'contact_email');
      if (emailData) {
        setContactEmail(emailData.content || '');
      }
      
      const buttonData = socialData.find(item => item.title === 'hire_button_text');
      if (buttonData) {
        setHireButtonText(buttonData.content || 'Hire Me');
      }
    }
  }, [socialData]);
  
  const handleSaveContactSettings = async () => {
    setIsSubmitting(true);
    try {
      // Save contact email
      const emailData = socialData?.find(item => item.title === 'contact_email');
      if (emailData) {
        await updateContentMutation.mutateAsync({
          id: emailData.id,
          updates: {
            content: contactEmail,
            section: 'social',
            title: 'contact_email',
            is_published: true
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: contactEmail,
          section: 'social',
          title: 'contact_email',
          is_published: true
        });
      }
      
      // Save button text
      const buttonData = socialData?.find(item => item.title === 'hire_button_text');
      if (buttonData) {
        await updateContentMutation.mutateAsync({
          id: buttonData.id,
          updates: {
            content: hireButtonText,
            section: 'social',
            title: 'hire_button_text',
            is_published: true
          }
        });
      } else {
        await createContentMutation.mutateAsync({
          content: hireButtonText,
          section: 'social',
          title: 'hire_button_text',
          is_published: true
        });
      }
      
      toast({
        title: 'Success',
        description: 'Contact settings saved successfully'
      });
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save contact settings',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="links">Social Links</TabsTrigger>
          <TabsTrigger value="contact">Contact Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="mt-6">
          <SocialMediaEditor />
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Button Settings</CardTitle>
              <CardDescription>
                Configure the contact button and email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@yourdomain.com"
                />
                <p className="text-xs text-muted-foreground">
                  This email will be used as the recipient for contact form submissions
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hireButtonText">Hire Button Text</Label>
                <Input
                  id="hireButtonText"
                  value={hireButtonText}
                  onChange={(e) => setHireButtonText(e.target.value)}
                  placeholder="Hire Me"
                />
                <p className="text-xs text-muted-foreground">
                  The text displayed on the hire button in the social media section
                </p>
              </div>
              
              <Button 
                onClick={handleSaveContactSettings} 
                disabled={isSubmitting}
                className="w-full mt-4"
              >
                {isSubmitting ? 'Saving...' : 'Save Contact Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialEditor;
