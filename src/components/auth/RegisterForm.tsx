
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import FloatingLabelInput from './FloatingLabelInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';

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

  // Form validation
  const isStep1Valid = firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '';
  const isStep2Valid = password.trim() !== '' && confirmPassword.trim() !== '' && passwordsMatch;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!passwordsMatch) {
        throw new Error('Passwords do not match');
      }
      
      await signUp(email, password, {
        full_name: `${firstName} ${lastName}`.trim(),
      });
      
      setShowSuccess(true);
      
      // Show success state briefly before closing modal
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created!',
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

  const nextStep = () => {
    if (currentStep < 2 && isStep1Valid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white">Registration Complete!</h3>
          <p className="text-white/60 mt-2">Your account has been created</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-6">
            {[1, 2].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${currentStep === step 
                      ? 'bg-elvis-pink text-white' 
                      : currentStep > step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-white/60'}`}
                >
                  {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
                </div>
                <span className="text-xs text-white/60 mt-1">
                  {step === 1 ? 'Account' : 'Security'}
                </span>
              </div>
            ))}
            <div 
              className="h-1 flex-1 mx-3"
              style={{
                background: `linear-gradient(to right, 
                  ${currentStep > 1 ? '#10b981' : '#ff00ff'} 50%, 
                  rgba(255,255,255,0.1) 50%)`,
                backgroundSize: '100% 100%',
              }}
            />
          </div>
          
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
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
                />
                
                <div className="flex justify-end pt-2">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="bg-elvis-gradient hover:opacity-90 transition-opacity"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div>
                    <FloatingLabelInput
                      id="password"
                      type="password"
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock className="h-4 w-4 text-white/50" />}
                      required
                      disabled={isSubmitting}
                    />
                    {password && <PasswordStrengthMeter password={password} />}
                  </div>
                  
                  <FloatingLabelInput
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4 text-white/50" />}
                    error={!passwordsMatch ? "Passwords must match" : undefined}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-md"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={prevStep}
                    className="border-white/20 hover:bg-white/10 text-white hover:text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !isStep2Valid}
                    className="bg-elvis-gradient hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      )}
    </AnimatePresence>
  );
};

export default RegisterForm;
