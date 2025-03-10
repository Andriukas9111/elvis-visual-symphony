
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HireMeForm from '@/components/hire-me/HireMeForm';
import { useToast } from '@/components/ui/use-toast';
import { useSubmitHireRequest } from '@/hooks/api/useHireRequests';

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const submitHireRequest = useSubmitHireRequest({
    onSuccess: () => {
      setFormSubmitted(true);
      toast({
        title: "Request submitted successfully",
        description: "We'll get back to you as soon as possible!",
      });
    },
    onError: (error) => {
      console.error('Error from useSubmitHireRequest onError:', error);
      toast({
        title: "Error submitting request",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmitRequest = async (formData) => {
    try {
      console.log('Submitting hire request:', formData);
      
      // Simplified request data object
      const requestData = {
        name: formData.name,
        email: formData.email,
        project_type: formData.project_type,
        project_description: formData.project_description,
        phone: formData.phone || null,
        company: formData.company || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        status: 'new'
      };
      
      console.log('Final hire request data being submitted:', requestData);
      
      await submitHireRequest.mutateAsync(requestData);
    } catch (error) {
      console.error("Error submitting hire request:", error);
      toast({
        title: "Error submitting request",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
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
          <HireMeForm 
            onSubmit={handleSubmitRequest} 
            isSubmitting={submitHireRequest.isPending} 
            submitted={formSubmitted}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
