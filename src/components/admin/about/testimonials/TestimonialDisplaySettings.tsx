
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Testimonial } from '@/components/home/about/types';

interface TestimonialDisplaySettingsProps {
  previewLimit: number;
  setPreviewLimit: (limit: number) => void;
  testimonials: Testimonial[];
}

const TestimonialDisplaySettings: React.FC<TestimonialDisplaySettingsProps> = ({
  previewLimit,
  setPreviewLimit,
  testimonials
}) => {
  const featuredCount = testimonials.filter(t => t.is_featured).length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Configure how testimonials are displayed on your site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="previewLimit">Preview Character Limit</Label>
          <div className="flex items-center gap-2">
            <Input
              id="previewLimit"
              type="number"
              value={previewLimit}
              onChange={(e) => setPreviewLimit(parseInt(e.target.value) || 50)}
              min={50}
              max={500}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              characters
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Limit the number of characters shown in the testimonial preview
          </p>
        </div>
        
        <div className="rounded-md bg-elvis-dark/40 p-4">
          <h3 className="text-sm font-medium mb-2">Testimonial Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Testimonials</p>
              <p className="text-xl font-bold">{testimonials.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Featured Testimonials</p>
              <p className="text-xl font-bold">{featuredCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialDisplaySettings;
