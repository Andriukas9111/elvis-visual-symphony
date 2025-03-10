
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Testimonial } from '@/components/home/about/types';

interface TestimonialPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  previewLimit: number;
}

const TestimonialPreviewDialog: React.FC<TestimonialPreviewDialogProps> = ({
  open,
  onOpenChange,
  testimonial,
  previewLimit
}) => {
  if (!testimonial) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Testimonial Preview</DialogTitle>
          <DialogDescription>
            Preview how this testimonial will appear to users
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-6 bg-background rounded-lg border">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              {testimonial.avatar ? (
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              ) : (
                <AvatarFallback>{testimonial.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">
                {testimonial.position}, {testimonial.company}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative pl-8 italic text-muted-foreground">
              <span className="absolute top-0 left-0 text-3xl leading-none">"</span>
              <p>{testimonial.quote}</p>
              <span className="absolute bottom-0 right-0 text-3xl leading-none">"</span>
            </div>

            {testimonial.quote.length > previewLimit && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">In list view (truncated):</h4>
                <p className="italic text-muted-foreground">"{testimonial.quote.substring(0, previewLimit)}..."</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialPreviewDialog;
