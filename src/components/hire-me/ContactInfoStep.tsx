
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface ContactInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ formData, updateFormData, onNext, onPrev }: ContactInfoStepProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(formData.email);
  
  const isDisabled = 
    !formData.name || 
    formData.name.trim().length < 2 || 
    !formData.email || 
    !isValidEmail;
  
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex-1 flex flex-col"
    >
      <motion.h3 
        variants={itemVariants} 
        className="text-2xl font-bold mb-2 text-center"
      >
        Your Contact Information
      </motion.h3>
      
      <motion.p 
        variants={itemVariants} 
        className="text-white/70 text-center mb-8"
      >
        How can we reach you about your project?
      </motion.p>
      
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="bg-elvis-darker border-white/20 focus:border-elvis-pink"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              className="bg-elvis-darker border-white/20 focus:border-elvis-pink"
              required
            />
            {formData.email && !isValidEmail && (
              <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="bg-elvis-darker border-white/20 focus:border-elvis-pink"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company/Organization (Optional)</Label>
            <Input
              id="company"
              name="company"
              placeholder="Your company or organization"
              value={formData.company}
              onChange={handleChange}
              className="bg-elvis-darker border-white/20 focus:border-elvis-pink"
            />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="mt-auto flex justify-between pt-8"
      >
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/5"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          className="bg-elvis-gradient hover:shadow-pink-glow transition-all duration-300"
          size="lg"
          disabled={isDisabled}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ContactInfoStep;
