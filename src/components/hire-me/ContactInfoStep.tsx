
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormData } from './HireMeForm';
import { ChevronLeft, Loader2, Send, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSubmitHireRequest } from '@/hooks/useSupabase';

interface ContactInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  prevStep: () => void;
  resetForm: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  updateFormData,
  prevStep,
  resetForm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validations, setValidations] = useState({
    name: { valid: false, touched: false },
    email: { valid: false, touched: false },
    phone: { valid: false, touched: false },
  });
  const { toast } = useToast();
  const submitHireRequest = useSubmitHireRequest();

  // Initialize validation state based on existing formData
  useEffect(() => {
    setValidations({
      name: { 
        valid: validateName(formData.name || ''), 
        touched: (formData.name || '').length > 0 
      },
      email: { 
        valid: validateEmail(formData.email || ''), 
        touched: (formData.email || '').length > 0 
      },
      phone: { 
        valid: validatePhone(formData.phone || ''), 
        touched: (formData.phone || '').length > 0 
      },
    });
  }, [formData]);

  // Validation functions
  const validateName = (value: string) => value.length >= 2;
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value);

  const handleInputChange = (field: 'name' | 'email' | 'phone', value: string) => {
    updateFormData({ [field]: value });
    
    let isValid = false;
    
    switch (field) {
      case 'name':
        isValid = validateName(value);
        break;
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
    }
    
    setValidations(prev => ({
      ...prev,
      [field]: { valid: isValid, touched: true }
    }));
  };

  const isFormValid = () => {
    return validations.name.valid && validations.email.valid && validations.phone.valid;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Please fill all required fields",
        description: "Make sure all fields are filled out correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formatting the request data to match the expected format by the API
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        project_type: formData.projectType || '',
        project_description: formData.projectDetails,
        budget: formData.budget,
        timeline: formData.date ? formData.date.toISOString() : null,
      };
      
      await submitHireRequest.mutateAsync(requestData);
      
      setIsSuccess(true);
      toast({
        title: "Request submitted successfully!",
        description: "I'll be in touch with you shortly.",
        variant: "default",
      });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting hire request:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="mb-6">
            <Label htmlFor="name" className="text-white text-lg mb-2 block">
              Your Name <span className="text-elvis-pink">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                className={`bg-elvis-darker text-white border ${
                  validations.name.touched 
                    ? validations.name.valid 
                      ? 'border-green-500' 
                      : 'border-red-500'
                    : 'border-gray-600'
                } rounded-lg p-3 w-full focus:ring-1 focus:ring-elvis-pink`}
              />
              {validations.name.touched && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validations.name.valid ? (
                    <Check className="text-green-500 h-5 w-5" />
                  ) : (
                    <X className="text-red-500 h-5 w-5" />
                  )}
                </div>
              )}
            </div>
            {validations.name.touched && !validations.name.valid && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid name</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="email" className="text-white text-lg mb-2 block">
              Email Address <span className="text-elvis-pink">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className={`bg-elvis-darker text-white border ${
                  validations.email.touched 
                    ? validations.email.valid 
                      ? 'border-green-500' 
                      : 'border-red-500'
                    : 'border-gray-600'
                } rounded-lg p-3 w-full focus:ring-1 focus:ring-elvis-pink`}
              />
              {validations.email.touched && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validations.email.valid ? (
                    <Check className="text-green-500 h-5 w-5" />
                  ) : (
                    <X className="text-red-500 h-5 w-5" />
                  )}
                </div>
              )}
            </div>
            {validations.email.touched && !validations.email.valid && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>
          
          <div className="mb-6">
            <Label htmlFor="phone" className="text-white text-lg mb-2 block">
              Phone Number <span className="text-elvis-pink">*</span>
            </Label>
            <div className="relative">
              <Input
                required
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Your phone number"
                className={`bg-elvis-darker text-white border ${
                  validations.phone.touched 
                    ? validations.phone.valid 
                      ? 'border-green-500' 
                      : 'border-red-500'
                    : 'border-gray-600'
                } rounded-lg p-3 w-full focus:ring-1 focus:ring-elvis-pink`}
              />
              {validations.phone.touched && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validations.phone.valid ? (
                    <Check className="text-green-500 h-5 w-5" />
                  ) : (
                    <X className="text-red-500 h-5 w-5" />
                  )}
                </div>
              )}
            </div>
            {validations.phone.touched && !validations.phone.valid && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid phone number</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            type="button" 
            variant="outline" 
            className="border-elvis-pink text-white" 
            onClick={prevStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            type="button" 
            className={`bg-elvis-gradient text-white px-8 ${!isFormValid() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-elvis-pink/90'}`}
            disabled={!isFormValid() || isSubmitting || isSuccess}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submitted!
              </>
            ) : (
              <>
                Submit Request
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
