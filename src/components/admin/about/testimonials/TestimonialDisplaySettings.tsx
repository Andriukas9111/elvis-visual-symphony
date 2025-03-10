
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Testimonial } from '@/components/home/about/types';

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
  // Find the longest testimonial to use as a reference
  const longestTestimonial = React.useMemo(() => {
    if (testimonials.length === 0) return null;
    return testimonials.reduce((longest, current) => 
      current.quote.length > longest.quote.length ? current : longest
    );
  }, [testimonials]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Configure how testimonials appear on your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="preview-limit" className="mb-2 block">
              Preview Character Limit: {previewLimit} characters
            </Label>
            <Slider
              id="preview-limit"
              value={[previewLimit]}
              onValueChange={(value) => setPreviewLimit(value[0])}
              min={50}
              max={300}
              step={10}
              className="py-4"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This controls how many characters of a testimonial are shown in the list view before a "Read More" link appears.
            </p>
          </div>

          {longestTestimonial && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <Separator className="my-4" />
              <div className="p-4 border rounded-md">
                <p className="italic text-muted-foreground">
                  "{longestTestimonial.quote.substring(0, previewLimit)}
                  {longestTestimonial.quote.length > previewLimit && "..."}
                  {longestTestimonial.quote.length > previewLimit && (
                    <span className="text-blue-500 not-italic ml-1">Read More</span>
                  )}"
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialDisplaySettings;
