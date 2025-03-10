
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestimonialPaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSelect: (page: number) => void;
}

const TestimonialPagination: React.FC<TestimonialPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onNextPage, 
  onPrevPage,
  onPageSelect
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onPrevPage}
          disabled={currentPage === 0}
          className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1}
          className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageSelect(index)}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentPage ? 'bg-elvis-pink' : 'bg-white/30'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default TestimonialPagination;
