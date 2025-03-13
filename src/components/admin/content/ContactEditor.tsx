
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCreateContent, useUpdateContent } from '@/hooks/api/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ContactEditor = () => {
  const { toast } = useToast();
  const { data: contactContent, isLoading, error } = useContent('contact');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [mainText, setMainText] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contactContent && contactContent.length > 0) {
      // Find main contact content
      const mainContent = contactContent.find(c => c.ordering === 0) || contactContent[0];
      setHeading(mainContent.title || '');
      setSubheading(mainContent.subtitle || '');
      setMainText(mainContent.content || '');
      
      // Find contact details
      const emailContent = contactContent.find(c => c.title === 'Email');
      const phoneContent = contactContent.find(c => c.title === 'Phone');
      const locationContent = contactContent.find(c => c.title === 'Location');
      
      if (emailContent) setEmailAddress(emailContent.content || '');
      if (phoneContent) setPhoneNumber(phoneContent.content || '');
      if (locationContent) setLocation(locationContent.content || '');
    }
  }, [contactContent]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update or create main contact content
      if (contactContent && contactContent.length > 0) {
        const mainContent = contactContent.find(c => c.ordering === 0) || contactContent[0];
        await updateMutation.mutateAsync({
          id: mainContent.id,
          updates: {
            title: heading,
            subtitle: subheading,
            content: mainText
          }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'contact',
          title: heading,
          subtitle: subheading,
          content: mainText,
          is_published: true,
          ordering: 0
        });
      }
      
      // Handle contact details - Email
      const emailContent = contactContent?.find(c => c.title === 'Email');
      if (emailContent) {
        await updateMutation.mutateAsync({
          id: emailContent.id,
          updates: { content: emailAddress }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'contact',
          title: 'Email',
          content: emailAddress,
          is_published: true,
          ordering: 1
        });
      }
      
      // Handle contact details - Phone
      const phoneContent = contactContent?.find(c => c.title === 'Phone');
      if (phoneContent) {
        await updateMutation.mutateAsync({
          id: phoneContent.id,
          updates: { content: phoneNumber }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'contact',
          title: 'Phone',
          content: phoneNumber,
          is_published: true,
          ordering: 2
        });
      }
      
      // Handle contact details - Location
      const locationContent = contactContent?.find(c => c.title === 'Location');
      if (locationContent) {
        await updateMutation.mutateAsync({
          id: locationContent.id,
          updates: { content: location }
        });
      } else {
        await createMutation.mutateAsync({
          section: 'contact',
          title: 'Location',
          content: location,
          is_published: true,
          ordering: 3
        });
      }
      
      toast({
        title: "Contact content saved",
        description: "Your contact section has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving contact content:', error);
      toast({
        title: "Error saving content",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading contact content. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Section Content</CardTitle>
          <CardDescription>
            Edit the main content and headings for the contact section
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactHeading">Section Heading</Label>
            <Input 
              id="contactHeading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactSubheading">Section Subheading</Label>
            <Input 
              id="contactSubheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Enter section subheading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactMainText">Main Text</Label>
            <Textarea 
              id="contactMainText" 
              value={mainText} 
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Enter main contact text" 
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Edit your contact information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input 
              id="emailAddress" 
              value={emailAddress} 
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="e.g., contact@example.com" 
              type="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +1 (123) 456-7890" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY" 
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContactEditor;
