
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import FormStepIndicator from './FormStepIndicator';
import ProjectTypeStep from './ProjectTypeStep';
import ProjectDetailsStep from './ProjectDetailsStep';
import BudgetDateStep from './BudgetDateStep';
import ContactInfoStep from './ContactInfoStep';
import SubmissionSuccessStep from './SubmissionSuccessStep';
import { Camera, Film, Calendar, DollarSign, Send, User } from 'lucide-react';
import AnimatedSection from '@/components/layout/AnimatedSection';

export type ProjectType = 'event' | 'commercial' | 'wedding' | 'music' | 'documentary' | 'other';
export type BudgetRange = 'low' | 'medium' | 'high' | 'custom';

export interface FormData {
  projectType: ProjectType | null;
  projectDetails: string;
  budget: number;
  date: Date | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  files: File[];
}

const initialFormData: FormData = {
  projectType: null,
  projectDetails: '',
  budget: 1000,
  date: null,
  name: '',
  email: '',
  phone: '',
  message: '',
  files: []
};

const steps = [
  { 
    title: 'Project Type', 
    description: 'What kind of video do you need?',
    icon: <Camera className="w-5 h-5" /> 
  },
  { 
    title: 'Project Details', 
    description: 'Tell me about your vision',
    icon: <Film className="w-5 h-5" /> 
  },
  { 
    title: 'Budget & Date', 
    description: 'When and what budget?',
    icon: <DollarSign className="w-5 h-5" /> 
  },
  { 
    title: 'Contact Info', 
    description: 'How can I reach you?',
    icon: <User className="w-5 h-5" /> 
  }
];

const HireMeForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Form submitted successfully!",
        description: "I'll get back to you within 48 hours.",
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSuccess(false);
  };

  return (
    <section id="hire-me" className="relative py-20 overflow-hidden bg-elvis-dark">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-elvis-pink/10 blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-elvis-purple/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <AnimatedSection variant="fadeInUp" className="text-center mb-16">
          <h2 className="text-gradient mb-4">Hire Me</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Ready to bring your vision to life? Fill out the form below and let's create something amazing together.
          </p>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto">
          {!isSuccess ? (
            <div className="glass-card p-8 relative overflow-hidden">
              {/* Step indicators */}
              <FormStepIndicator 
                steps={steps} 
                currentStep={currentStep} 
                onChange={(step) => setCurrentStep(step)} 
              />
              
              {/* Form content */}
              <div className="mt-12 min-h-[400px]">
                {currentStep === 0 && (
                  <ProjectTypeStep 
                    formData={formData}
                    updateFormData={updateFormData}
                    nextStep={nextStep}
                  />
                )}
                
                {currentStep === 1 && (
                  <ProjectDetailsStep 
                    formData={formData}
                    updateFormData={updateFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                )}
                
                {currentStep === 2 && (
                  <BudgetDateStep 
                    formData={formData}
                    updateFormData={updateFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                )}
                
                {currentStep === 3 && (
                  <ContactInfoStep 
                    formData={formData}
                    updateFormData={updateFormData}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>
          ) : (
            <SubmissionSuccessStep resetForm={resetForm} formData={formData} />
          )}
        </div>
      </div>
    </section>
  );
};

export default HireMeForm;
