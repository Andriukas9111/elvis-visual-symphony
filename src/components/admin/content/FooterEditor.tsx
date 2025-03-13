
import React, { useState, useEffect } from 'react';
import { useContent, useUpdateContent, useCreateContent } from '@/hooks/api/useContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

const FooterEditor: React.FC = () => {
  const { data: footerContent, isLoading, error } = useContent('footer');
  const updateContent = useUpdateContent();
  const createContent = useCreateContent();
  
  const [copyright, setCopyright] = useState('© 2024 Elvis Creative. All rights reserved.');
  const [showSocial, setShowSocial] = useState(true);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentIds, setContentIds] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (footerContent && footerContent.length > 0) {
      // Main copyright content
      const mainContent = footerContent.find(c => c.ordering === 0);
      if (mainContent) {
        setCopyright(mainContent.content || '');
        setShowSocial(mainContent.button_text === 'true');
        setContentIds(prev => ({ ...prev, main: mainContent.id }));
      }
      
      // Footer links
      const linkItems = footerContent.filter(c => c.ordering > 0).map(c => ({
        id: c.id,
        label: c.title || '',
        url: c.button_url || ''
      }));
      
      if (linkItems.length > 0) {
        setLinks(linkItems);
      }
    }
  }, [footerContent]);
  
  const handleAddLink = () => {
    setLinks([...links, { id: `temp-${Date.now()}`, label: '', url: '' }]);
  };
  
  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  
  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update or create main content
      const mainContentData = {
        content: copyright,
        button_text: showSocial ? 'true' : 'false',
        section: 'footer',
        ordering: 0,
        is_published: true
      };
      
      if (contentIds.main) {
        await updateContent.mutateAsync({
          id: contentIds.main,
          updates: mainContentData
        });
      } else {
        const newContent = await createContent.mutateAsync(mainContentData as any);
        setContentIds(prev => ({ ...prev, main: newContent.id }));
      }
      
      // Handle links
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const linkData = {
          title: link.label,
          button_url: link.url,
          section: 'footer',
          ordering: i + 1,
          is_published: true
        };
        
        if (link.id.startsWith('temp-')) {
          // Create new link
          const newLink = await createContent.mutateAsync(linkData as any);
          // Update the link ID in state
          setLinks(prev => prev.map((l, idx) => i === idx ? { ...l, id: newLink.id } : l));
        } else {
          // Update existing link
          await updateContent.mutateAsync({
            id: link.id,
            updates: linkData
          });
        }
      }
      
      toast.success('Footer settings updated successfully');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-500/10 p-4 rounded-md text-red-500">
        Error loading footer content
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="© 2024 Your Company. All rights reserved."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="showSocial"
              checked={showSocial}
              onCheckedChange={setShowSocial}
            />
            <Label htmlFor="showSocial">Show Social Media Icons</Label>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Footer Links</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddLink}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Link
              </Button>
            </div>
            
            {links.map((link, index) => (
              <div key={link.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <Input
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    placeholder="Link Label"
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    placeholder="URL (e.g., /about)"
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Footer Settings'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default FooterEditor;
