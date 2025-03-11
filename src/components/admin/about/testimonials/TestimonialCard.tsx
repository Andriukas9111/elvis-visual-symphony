
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  reordering: boolean;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onUpdateFeatured: (id: string, isFeatured: boolean) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  reordering,
  onEdit,
  onDelete,
  onMove,
  onUpdateFeatured,
  isFirst,
  isLast,
}) => {
  return (
    <Card key={testimonial.id}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{testimonial.name}</h4>
              {testimonial.is_featured && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {reordering ? (
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMove(testimonial.id, 'up')}
                  disabled={isFirst}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMove(testimonial.id, 'down')}
                  disabled={isLast}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Select 
                  value={testimonial.is_featured ? 'featured' : 'normal'}
                  onValueChange={(value) => {
                    onUpdateFeatured(testimonial.id, value === 'featured');
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="normal">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(testimonial)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
            {testimonial.avatar_url && (
              <img
                src={testimonial.avatar_url}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <p className="mt-2 text-sm">{testimonial.content}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
