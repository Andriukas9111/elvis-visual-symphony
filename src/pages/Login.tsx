
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
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
  
  const { signIn, signUp, user } = useAuth();
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 text-white"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="#" className="text-sm text-elvis-pink hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
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
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-white/5 border-white/10 text-white"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="bg-white/5 border-white/10 text-white"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 text-white"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={!passwordsMatch ? "text-red-400" : ""}>
                      Confirm Password {!passwordsMatch && "(Passwords do not match)"}
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className={`bg-white/5 border-white/10 text-white ${!passwordsMatch ? "border-red-400" : ""}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
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
      
      <Footer />
    </div>
  );
};

export default Login;
