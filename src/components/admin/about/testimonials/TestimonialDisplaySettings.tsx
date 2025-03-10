
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Testimonial } from '@/components/home/about/types';
import TestimonialCard from '@/components/home/about/TestimonialCard';

interface TestimonialDisplaySettingsProps {
  previewLimit: number;
  setPreviewLimit: (value: number) => void;
  testimonials: Testimonial[];
}

const TestimonialDisplaySettings: React.FC<TestimonialDisplaySettingsProps> = ({
  previewLimit,
  setPreviewLimit,
  testimonials
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Configure how testimonials are displayed on the frontend
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="character-limit" className="font-medium">
                Character Limit: <span className="text-elvis-pink">{previewLimit}</span> characters
              </Label>
              <span className="text-sm text-muted-foreground">
                Testimonials longer than this will show a "Read More" button
              </span>
            </div>
            <Slider
              id="character-limit"
              min={50}
              max={500}
              step={10}
              value={[previewLimit]}
              onValueChange={(values) => setPreviewLimit(values[0])}
              className="py-4"
            />
          </div>
          
          {testimonials && testimonials.length > 0 && (
            <div className="border rounded-lg p-4 bg-background/5">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <div key={testimonial.id} className="bg-card rounded-lg border">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      isInView={true}
                      characterLimit={previewLimit}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          The character limit controls when testimonials are truncated on the public site.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TestimonialDisplaySettings;
