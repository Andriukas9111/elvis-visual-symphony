
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';
import { Testimonial } from './types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TestimonialsListProps {
  testimonials: Testimonial[];
  paginatedTestimonials: Testimonial[];
  isLoading: boolean;
  reordering: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onUpdateFeatured: (id: string, isFeatured: boolean) => void;
  toggleReordering: () => void;
}

export const TestimonialsList: React.FC<TestimonialsListProps> = ({
  testimonials,
  paginatedTestimonials,
  isLoading,
  reordering,
  currentPage,
  totalPages,
  setCurrentPage,
  onEdit,
  onDelete,
  onMove,
  onUpdateFeatured,
  toggleReordering,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <Card>
        <div className="py-4 text-center text-muted-foreground">
          No testimonials yet. Add your first one above.
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Existing Testimonials</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleReordering}
          >
            {reordering ? 'Done Reordering' : 'Reorder Testimonials'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {paginatedTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            reordering={reordering}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onUpdateFeatured={onUpdateFeatured}
            isFirst={testimonials.indexOf(testimonial) === 0}
            isLast={testimonials.indexOf(testimonial) === testimonials.length - 1}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default TestimonialsList;
