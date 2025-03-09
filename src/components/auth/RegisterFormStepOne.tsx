
import React from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingLabelInput from './FloatingLabelInput';

type RegisterFormStepOneProps = {
  firstName: string;
  lastName: string;
  email: string;
  isSubmitting: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  nextStep: () => void;
};

const RegisterFormStepOne = ({
  firstName,
  lastName,
  email,
  isSubmitting,
  setFirstName,
  setLastName,
  setEmail,
  nextStep
}: RegisterFormStepOneProps) => {
  // Form validation
  const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '';
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FloatingLabelInput
          id="firstName"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          icon={<User className="h-4 w-4 text-white/50" />}
          required
          disabled={isSubmitting}
        />
        
        <FloatingLabelInput
          id="lastName"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          icon={<User className="h-4 w-4 text-white/50" />}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <FloatingLabelInput
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="h-4 w-4 text-white/50" />}
        required
        disabled={isSubmitting}
        className="border-violet-500 bg-white/5"
      />
      
      <div className="flex justify-end pt-2">
        <Button 
          type="button" 
          onClick={nextStep}
          disabled={!isFormValid}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:opacity-90 transition-opacity"
        >
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterFormStepOne;
