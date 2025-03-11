
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialsList from "../testimonials/TestimonialsList";
import { Testimonial } from "../testimonials/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 5;

const TestimonialsForm: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [paginatedTestimonials, setPaginatedTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reordering, setReordering] = useState(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("order_index");
        
      if (error) throw error;
      return data || [];
    },
    onSuccess: (data) => {
      setTestimonials(data);
      updatePagination(data, currentPage);
    }
  });
  
  useEffect(() => {
    if (data) {
      updatePagination(data, currentPage);
    }
  }, [currentPage, data]);
  
  const updatePagination = (items: Testimonial[], page: number) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages || 1);
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedTestimonials(items.slice(startIndex, endIndex));
  };
  
  const handleEditTestimonial = (testimonial: Testimonial) => {
    // For now just show a toast - this would typically open a modal
    toast.info(`Edit testimonial: ${testimonial.name}`);
    // Implement actual edit functionality here
  };
  
  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("Testimonial deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };
  
  const handleMoveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = testimonials.findIndex(t => t.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= testimonials.length) return;
    
    const updatedTestimonials = [...testimonials];
    const [movedItem] = updatedTestimonials.splice(currentIndex, 1);
    updatedTestimonials.splice(newIndex, 0, movedItem);
    
    // Update order_index values
    const reorderedTestimonials = updatedTestimonials.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    setTestimonials(reorderedTestimonials);
    updatePagination(reorderedTestimonials, currentPage);
    
    try {
      // Update order_index in database
      for (const item of reorderedTestimonials) {
        await supabase
          .from("testimonials")
          .update({ order_index: item.order_index })
          .eq("id", item.id);
      }
      
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating testimonial order:", error);
      toast.error("Failed to update order");
      refetch();
    }
  };
  
  const handleUpdateFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_featured: isFeatured })
        .eq("id", id);
        
      if (error) throw error;
      
      setTestimonials(prev => 
        prev.map(item => 
          item.id === id ? { ...item, is_featured: isFeatured } : item
        )
      );
      
      toast.success(`Testimonial ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error("Error updating testimonial featured status:", error);
      toast.error("Failed to update featured status");
    }
  };
  
  const toggleReordering = () => {
    setReordering(!reordering);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium mb-2">Testimonials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage the testimonials displayed on your about page.
              </p>
            </div>
            <Button 
              className="bg-elvis-pink hover:bg-elvis-pink/90" 
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
          
          <TestimonialsList 
            testimonials={testimonials}
            paginatedTestimonials={paginatedTestimonials}
            isLoading={isLoading}
            reordering={reordering}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onEdit={handleEditTestimonial}
            onDelete={handleDeleteTestimonial}
            onMove={handleMoveTestimonial}
            onUpdateFeatured={handleUpdateFeatured}
            toggleReordering={toggleReordering}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsForm;
