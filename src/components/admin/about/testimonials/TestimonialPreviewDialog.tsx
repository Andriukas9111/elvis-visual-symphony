
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="bg-elvis-medium border-elvis-pink/20 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle>Testimonial Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {testimonial.avatar ? (
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              ) : (
                <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-white/70">
                {testimonial.position}, {testimonial.company}
              </p>
            </div>
          </div>
          
          <div className="bg-elvis-dark/50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{testimonial.quote}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 h-px bg-white/20"></div>
            <p className="text-white/60">
              {testimonial.quote.length} characters
            </p>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          
          <div>
            <p className="text-sm text-white/70">Preview with {previewLimit} character limit:</p>
            <div className="mt-2 bg-elvis-dark p-3 rounded border border-white/10">
              {testimonial.quote.length > previewLimit ? (
                <>
                  <p>{testimonial.quote.substring(0, previewLimit)}...</p>
                  <button className="text-elvis-pink text-sm mt-2 hover:underline">
                    Read More
                  </button>
                </>
              ) : (
                <p>{testimonial.quote}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialPreviewDialog;
