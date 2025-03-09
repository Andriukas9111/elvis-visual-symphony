
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
import { useSubmitHireRequest } from '@/hooks/useSupabase';

export type ProjectType = 'event' | 'commercial' | 'wedding' | 'music' | 'documentary' | 'other';
export type BudgetRange = 'low' | 'medium' | 'high' | 'custom';

export interface FormData {
  projectType: ProjectType | null;
  projectDetails: string;
  budget: number;
  date: Date | null;
  deadline?: string; // Adding deadline field
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
  const submitHireRequest = useSubmitHireRequest();

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

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSuccess(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to the format expected by the hire_requests table
      const requestData = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || null,
        project_type: formData.projectType || '',
        project_description: formData.projectDetails,
        budget: formData.budget,
        timeline: formData.date ? formData.date.toISOString() : null
      };
      
      // Submit to Supabase
      await submitHireRequest.mutateAsync(requestData);
      
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
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
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
                resetForm={resetForm}
              />
            )}
          </div>
        </div>
      ) : (
        <SubmissionSuccessStep resetForm={resetForm} formData={formData} />
      )}
    </div>
  );
};

export default HireMeForm;
