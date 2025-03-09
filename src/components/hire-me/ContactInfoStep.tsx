
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormData } from './HireMeForm';
import { ChevronLeft, Loader2, Send, Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  prevStep: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ 
  formData, 
  updateFormData, 
  prevStep,
  handleSubmit,
  isSubmitting
}) => {
  const [validations, setValidations] = useState({
    name: { valid: false, touched: false },
    email: { valid: false, touched: false },
    phone: { valid: false, touched: false },
  });

  // Validation functions
  const validateName = (value: string) => value.length >= 2;
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^[\d\s()+\-]{7,15}$/.test(value);

  // Handle input change with live validation
  const handleInputChange = (name: keyof typeof validations, value: string) => {
    let isValid = false;
    
    if (name === 'name') isValid = validateName(value);
    if (name === 'email') isValid = validateEmail(value);
    if (name === 'phone') isValid = validatePhone(value);
    
    setValidations(prev => ({
      ...prev,
      [name]: { valid: isValid, touched: true }
    }));
    
    updateFormData({ [name]: value } as any);
  };

  // Check if form is valid
  const isFormValid = 
    validations.name.valid && 
    validations.email.valid && 
    validations.phone.valid;

  // Animation variants for validation icons
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white">Contact Information</h3>
      <p className="text-gray-400">How can I reach you about your project?</p>
      
      <div className="space-y-6 mt-6">
        {/* Name input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="name" className="text-white">Name</Label>
            {validations.name.touched && (
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="text-sm"
              >
                {validations.name.valid ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Valid
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center">
                    <X className="w-4 h-4 mr-1" /> Required
                  </span>
                )}
              </motion.div>
            )}
          </div>
          <div className="relative">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
              className={`bg-elvis-darker border ${
                validations.name.touched 
                  ? validations.name.valid 
                    ? 'border-green-500' 
                    : 'border-red-400' 
                  : 'border-elvis-medium'
              }`}
            />
          </div>
        </div>
        
        {/* Email input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="email" className="text-white">Email</Label>
            {validations.email.touched && (
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="text-sm"
              >
                {validations.email.valid ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Valid
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center">
                    <X className="w-4 h-4 mr-1" /> Invalid format
                  </span>
                )}
              </motion.div>
            )}
          </div>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            className={`bg-elvis-darker border ${
              validations.email.touched 
                ? validations.email.valid 
                  ? 'border-green-500' 
                  : 'border-red-400' 
                : 'border-elvis-medium'
            }`}
          />
        </div>
        
        {/* Phone input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="phone" className="text-white">Phone</Label>
            {validations.phone.touched && (
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="text-sm"
              >
                {validations.phone.valid ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Valid
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center">
                    <X className="w-4 h-4 mr-1" /> Invalid format
                  </span>
                )}
              </motion.div>
            )}
          </div>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Your phone number"
            className={`bg-elvis-darker border ${
              validations.phone.touched 
                ? validations.phone.valid 
                  ? 'border-green-500' 
                  : 'border-red-400' 
                : 'border-elvis-medium'
            }`}
          />
        </div>
        
        {/* Additional message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">Additional Details (Optional)</Label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => updateFormData({ message: e.target.value })}
            placeholder="Any other details you'd like to share..."
            className="w-full h-24 p-4 rounded-md bg-elvis-darker border border-elvis-medium text-white resize-none focus:outline-none focus:ring-2 focus:ring-elvis-pink"
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <motion.button
          className="btn-outline px-6 py-2 rounded-full font-medium flex items-center"
          onClick={prevStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </motion.button>
        
        <motion.button
          className={`btn-primary px-8 py-3 rounded-full font-medium flex items-center ${
            !isFormValid || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          whileHover={{ scale: isFormValid && !isSubmitting ? 1.05 : 1 }}
          whileTap={{ scale: isFormValid && !isSubmitting ? 0.95 : 1 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContactInfoStep;
