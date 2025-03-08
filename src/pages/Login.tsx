
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  // Password reset state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Set loaded state for animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [user, navigate]);

  useEffect(() => {
    // Check if passwords match
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signUp(registerEmail, registerPassword, {
        full_name: `${firstName} ${lastName}`.trim(),
      });
      // Note: In real scenario, user might need to verify email before being able to login
      // Here we're just showing the login tab
      const element = document.querySelector('[data-state="inactive"][value="login"]');
      if (element) {
        (element as HTMLElement).click();
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetSubmitting(true);
    
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setResetSubmitting(false);
    }
  };
  
  const closeResetDialog = () => {
    setResetDialogOpen(false);
    // Reset the form state after a delay to allow the close animation
    setTimeout(() => {
      setResetEmail("");
      setResetSent(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-0">
        <div className="container mx-auto">
          <div 
            className="max-w-md mx-auto glass-card p-8 rounded-2xl"
            style={{ 
              opacity: 0,
              transform: 'translateY(20px)',
              animation: isLoaded ? 'fade-in 0.5s ease-out forwards' : 'none'
            }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-white/60 mt-2">Sign in to your Elvis Creative account</p>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-elvis-pink data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="h-4 w-4 text-white/50" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/10 text-white pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => setResetDialogOpen(true)}
                        className="text-sm text-elvis-pink hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-4 w-4 text-white/50" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-white/5 border-white/10 text-white pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-elvis-gradient" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-white/60">
                    Don't have an account?{' '}
                    <button
                      type="button" 
                      className="text-elvis-pink hover:underline"
                      onClick={() => {
                        const element = document.querySelector('[data-state="inactive"][value="register"]');
                        if (element) {
                          (element as HTMLElement).click();
                        }
                      }}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <form className="space-y-6" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="h-4 w-4 text-white/50" />
                        </div>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="bg-white/5 border-white/10 text-white pl-10"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="h-4 w-4 text-white/50" />
                        </div>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="bg-white/5 border-white/10 text-white pl-10"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="h-4 w-4 text-white/50" />
                      </div>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/5 border-white/10 text-white pl-10"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-4 w-4 text-white/50" />
                      </div>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-white/5 border-white/10 text-white pl-10"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={!passwordsMatch ? "text-red-400" : ""}>
                      Confirm Password {!passwordsMatch && "(Passwords do not match)"}
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="h-4 w-4 text-white/50" />
                      </div>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className={`bg-white/5 border-white/10 text-white pl-10 ${!passwordsMatch ? "border-red-400" : ""}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-elvis-gradient" 
                    disabled={isSubmitting || !passwordsMatch}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-white/60">
                    Already have an account?{' '}
                    <button
                      type="button" 
                      className="text-elvis-pink hover:underline"
                      onClick={() => {
                        const element = document.querySelector('[data-state="inactive"][value="login"]');
                        if (element) {
                          (element as HTMLElement).click();
                        }
                      }}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Dialog open={resetDialogOpen} onOpenChange={closeResetDialog}>
        <DialogContent className="bg-elvis-medium border-none text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription className="text-white/60">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetSent ? (
            <div className="py-4">
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>
                  If an account exists with this email, you will receive a password reset link shortly.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-4 w-4 text-white/50" />
                  </div>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/10 text-white pl-10"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeResetDialog}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto bg-elvis-gradient"
                  disabled={resetSubmitting}
                >
                  {resetSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Login;
