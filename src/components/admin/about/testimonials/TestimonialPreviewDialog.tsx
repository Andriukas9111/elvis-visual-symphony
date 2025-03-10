
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Testimonial } from '@/components/home/about/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Star, Quote } from 'lucide-react';

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Testimonial Preview
            {testimonial.is_featured && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            Preview how this testimonial appears on your site
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4 space-y-4">
          <div className="bg-elvis-dark/30 rounded-xl p-6 space-y-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Avatar>
                {testimonial.avatar ? (
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                ) : (
                  <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Quote className="h-5 w-5 text-elvis-pink shrink-0 mt-1" />
              <p className="text-white/80">
                {testimonial.quote.length > previewLimit 
                  ? `${testimonial.quote.substring(0, previewLimit)}...` 
                  : testimonial.quote}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialPreviewDialog;
