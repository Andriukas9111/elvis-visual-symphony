
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterFormStepOne from './RegisterFormStepOne';
import RegisterFormStepTwo from './RegisterFormStepTwo';
import RegisterSuccess from './RegisterSuccess';
import StepIndicator from './StepIndicator';

type RegisterFormProps = {
  onSuccess: () => void;
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  // Check password match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!passwordsMatch) {
        throw new Error('Passwords do not match');
      }
      
      const fullName = `${firstName} ${lastName}`.trim();
      
      await signUp(email, password, {
        full_name: fullName,
      });
      
      setShowSuccess(true);
      
      // Show success state briefly before closing modal
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created! Please confirm your email to log in.',
      });
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
      
      toast({
        title: 'Registration Failed',
        description: err.message || 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <RegisterSuccess />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <StepIndicator currentStep={currentStep} totalSteps={2} />
          
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterFormStepOne 
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  isSubmitting={isSubmitting}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  setEmail={setEmail}
                  nextStep={nextStep}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterFormStepTwo 
                  password={password}
                  confirmPassword={confirmPassword}
                  isSubmitting={isSubmitting}
                  passwordsMatch={passwordsMatch}
                  error={error}
                  setPassword={setPassword}
                  setConfirmPassword={setConfirmPassword}
                  goBack={goBack}
                  handleSubmit={handleSubmit}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      )}
    </AnimatePresence>
  );
};

export default RegisterForm;
