
import React, { useState, useEffect } from 'react';
import { useContent, useUpdateContent, useCreateContent } from '@/hooks/api/useContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ScrollIndicatorEditor: React.FC = () => {
  const { data: scrollContent, isLoading, error } = useContent('scroll-indicator');
  const updateContent = useUpdateContent();
  const createContent = useCreateContent();
  
  const [label, setLabel] = useState('Discover');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (scrollContent && scrollContent.length > 0) {
      const content = scrollContent[0];
      setLabel(content.title || 'Discover');
      setContentId(content.id);
    }
  }, [scrollContent]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const contentData = {
        title: label,
        section: 'scroll-indicator',
        is_published: true
      };
      
      if (contentId) {
        await updateContent.mutateAsync({
          id: contentId,
          updates: contentData
        });
        toast.success('Scroll indicator updated successfully');
      } else {
        await createContent.mutateAsync(contentData as any);
        toast.success('Scroll indicator created successfully');
      }
    } catch (error) {
      console.error('Error saving scroll indicator:', error);
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
        Error loading scroll indicator content
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Scroll Indicator Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Text Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Discover, Scroll Down, Explore"
            />
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
            ) : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ScrollIndicatorEditor;
