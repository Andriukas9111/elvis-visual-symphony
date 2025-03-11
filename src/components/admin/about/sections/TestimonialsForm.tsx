
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialsList from "../testimonials/TestimonialsList";

const TestimonialsForm: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Testimonials</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage the testimonials displayed on your about page.
            </p>
          </div>
          
          <TestimonialsList />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsForm;
