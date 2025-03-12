
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from './types';

interface TestimonialDialogProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialDialog = ({ testimonial, isOpen, onClose }: TestimonialDialogProps) => {
  if (!testimonial) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-elvis-medium border-elvis-pink/20 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <span>Testimonial from {testimonial.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-elvis-pink/20">
              {testimonial.avatar ? (
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              ) : (
                <AvatarFallback className="bg-elvis-dark text-white text-lg">
                  {testimonial.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h3 className="text-xl font-bold">{testimonial.name}</h3>
              <p className="text-white/70">{testimonial.position}, {testimonial.company}</p>
            </div>
          </div>
          
          <div className="bg-elvis-dark/50 p-4 rounded-lg border border-elvis-pink/10">
            <p className="text-white/90 whitespace-pre-wrap">{testimonial.quote}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialDialog;
