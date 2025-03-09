
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, CheckCircle, ArrowRight, EyeOff, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
};

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form state
  const [regStep, setRegStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Reset form states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form states after animation completes
      setTimeout(() => {
        setLoginEmail('');
        setLoginPassword('');
        setFirstName('');
        setLastName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        setPasswordsMatch(true);
        setRegStep(1);
        setRegistrationSuccess(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 300);
    }
  }, [isOpen]);

  // Check password strength and match
  useEffect(() => {
    if (registerPassword) {
      let strength = 0;
      if (registerPassword.length >= 8) strength += 1;
      if (/[A-Z]/.test(registerPassword)) strength += 1;
      if (/[0-9]/.test(registerPassword)) strength += 1;
      if (/[^A-Za-z0-9]/.test(registerPassword)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }

    if (confirmPassword) {
      setPasswordsMatch(registerPassword === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [registerPassword, confirmPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(loginEmail, loginPassword);
      toast({
        title: "Login successful",
        description: "Welcome back! You've been logged in successfully.",
      });
      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    setRegStep(2);
  };

  const handleRegisterBack = () => {
    setRegStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch || passwordStrength < 2) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signUp(registerEmail, registerPassword, {
        full_name: `${firstName} ${lastName}`.trim(),
        first_name: firstName,
        last_name: lastName,
      });
      
      setRegistrationSuccess(true);
      setTimeout(() => {
        setActiveTab('login');
        setRegistrationSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-elvis-medium border-none text-white sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <DialogTitle className="text-center text-2xl font-bold mb-1">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
            <DialogDescription className="text-center text-white/60 mb-6">
              {activeTab === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Join us and unlock exclusive features'}
            </DialogDescription>

            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-elvis-light">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white transition-all duration-300"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="relative">
                    <div className="floating-label-group">
                      <Input
                        id="email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 peer"
                        required
                      />
                      <Label 
                        htmlFor="email" 
                        className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                      >
                        Email
                      </Label>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="floating-label-group">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 pr-10 peer"
                        required
                      />
                      <Label 
                        htmlFor="password" 
                        className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                      >
                        Password
                      </Label>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                        <Lock className="h-4 w-4" />
                      </div>
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {/* Handle forgot password */}}
                      className="text-sm text-elvis-pink hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-elvis-gradient hover:opacity-90 transition-opacity h-12 text-base" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </motion.div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <AnimatePresence mode="wait">
                  {registrationSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                      <p className="text-white/70 text-center mb-4">
                        Your account has been created. Please check your email to verify your account.
                      </p>
                    </motion.div>
                  ) : regStep === 1 ? (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                      onSubmit={handleRegisterNext}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <div className="floating-label-group">
                            <Input
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 peer"
                              required
                            />
                            <Label 
                              htmlFor="firstName" 
                              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                            >
                              First Name
                            </Label>
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="floating-label-group">
                            <Input
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 peer"
                              required
                            />
                            <Label 
                              htmlFor="lastName" 
                              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                            >
                              Last Name
                            </Label>
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                              <User className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="floating-label-group">
                          <Input
                            id="register-email"
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 peer"
                            required
                          />
                          <Label 
                            htmlFor="register-email" 
                            className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                          >
                            Email
                          </Label>
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                            <Mail className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="w-2/5 h-1 relative bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-elvis-pink rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <span className="text-white/60 text-sm">Step 1 of 2</span>
                        <Button 
                          type="submit" 
                          className="bg-elvis-gradient hover:opacity-90 transition-opacity"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                      onSubmit={handleRegister}
                    >
                      <div className="relative">
                        <div className="floating-label-group">
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 pr-10 peer"
                            required
                            minLength={8}
                          />
                          <Label 
                            htmlFor="register-password" 
                            className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-elvis-pink peer-valid:top-3 peer-valid:text-xs"
                          >
                            Password
                          </Label>
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                            <Lock className="h-4 w-4" />
                          </div>
                          <button 
                            type="button" 
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {registerPassword && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70">Password strength:</span>
                            <span className="text-xs">
                              {passwordStrength === 0 && "Very weak"}
                              {passwordStrength === 1 && "Weak"}
                              {passwordStrength === 2 && "Fair"}
                              {passwordStrength === 3 && "Good"}
                              {passwordStrength === 4 && "Strong"}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${passwordStrength * 25}%`,
                                backgroundColor: passwordStrength < 2 
                                  ? "rgb(239, 68, 68)" 
                                  : passwordStrength < 3 
                                    ? "rgb(234, 179, 8)" 
                                    : "rgb(34, 197, 94)"
                              }}
                              transition={{ duration: 0.3 }}
                              className="h-full rounded-full"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="relative">
                        <div className="floating-label-group">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cn(
                              "h-14 bg-white/5 border-white/10 text-white pl-10 pt-4 pr-10 peer",
                              !passwordsMatch && confirmPassword && "border-red-400"
                            )}
                            required
                          />
                          <Label 
                            htmlFor="confirm-password" 
                            className={cn(
                              "absolute left-10 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-valid:top-3 peer-valid:text-xs",
                              !passwordsMatch && confirmPassword && "text-red-400 peer-focus:text-red-400",
                              passwordsMatch && confirmPassword && "peer-valid:text-green-400 peer-focus:text-green-400"
                            )}
                          >
                            Confirm Password
                          </Label>
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                            <Lock className="h-4 w-4" />
                          </div>
                          <button 
                            type="button" 
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {!passwordsMatch && confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          Passwords do not match
                        </motion.p>
                      )}
                      
                      <div className="flex items-center justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleRegisterBack}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Back
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-2/5 h-1 relative bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-elvis-pink rounded-full" style={{ width: '100%' }}></div>
                          </div>
                          <span className="text-white/60 text-sm">Step 2 of 2</span>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-elvis-gradient hover:opacity-90 transition-opacity"
                          disabled={isSubmitting || !passwordsMatch || passwordStrength < 2}
                        >
                          {isSubmitting ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center"
                            >
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing Up...
                            </motion.div>
                          ) : (
                            <span>Create Account</span>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
