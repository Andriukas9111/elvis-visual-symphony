
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubmitHireRequest } from '@/hooks/useSupabase';
import HireMeForm from '@/components/hire-me/HireMeForm';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const { mutate: submitHireRequest, isPending } = useSubmitHireRequest({
    onSuccess: () => {
      toast({
        title: "Request submitted successfully",
        description: "We'll get back to you as soon as possible!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error submitting request",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });

  const handleSubmitRequest = (formData: any) => {
    // Ensure required fields are present
    const requiredFields = {
      name: formData.name,
      email: formData.email,
      project_type: formData.project_type,
      project_description: formData.project_description,
      // Default status to 'new' if not provided
      status: 'new'
    };
    
    // Add optional fields
    const requestData = {
      ...requiredFields,
      phone: formData.phone || null,
      company: formData.company || null,
      budget: formData.budget || null,
      timeline: formData.timeline || null
    };
    
    console.log('Submitting hire request:', requestData);
    submitHireRequest(requestData);
  };

  return (
    <section id="contact" className="py-20 bg-elvis-darker relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-elvis-purple/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-elvis-pink/10 rounded-full blur-[120px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Vision?</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Tell me about your project and I'll help bring your creative vision to life. 
            Fill out the form below to get started.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <HireMeForm onSubmit={handleSubmitRequest} isSubmitting={isPending} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
