
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectTypeStep from './ProjectTypeStep';
import ProjectDetailsStep from './ProjectDetailsStep';
import ContactInfoStep from './ContactInfoStep';
import BudgetDateStep from './BudgetDateStep';
import SubmissionSuccessStep from './SubmissionSuccessStep';
import FormStepIndicator from './FormStepIndicator';

const STEPS = [
  'Project Type',
  'Project Details',
  'Contact Info',
  'Budget & Timeline',
  'Complete',
];

type FormData = {
  project_type: string;
  project_description: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: number;
  timeline?: string;
};

interface HireMeFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

const HireMeForm = ({ onSubmit, isSubmitting }: HireMeFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    project_type: '',
    project_description: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: undefined,
    timeline: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsSubmitted(true);
    setCurrentStep(STEPS.length - 1);
  };

  return (
    <div className="bg-elvis-medium rounded-xl p-6 md:p-8 shadow-xl border border-white/10">
      <FormStepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="mt-8 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <ProjectTypeStep 
              key="step1"
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextStep}
            />
          )}
          
          {currentStep === 1 && (
            <ProjectDetailsStep 
              key="step2"
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}
          
          {currentStep === 2 && (
            <ContactInfoStep 
              key="step3"
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}
          
          {currentStep === 3 && (
            <BudgetDateStep 
              key="step4"
              formData={formData}
              updateFormData={updateFormData}
              onPrev={handlePrevStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
          
          {currentStep === 4 && isSubmitted && (
            <SubmissionSuccessStep key="step5" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HireMeForm;
