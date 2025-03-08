
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

enum ResetState {
  INITIAL,
  SUBMITTING,
  SUCCESS,
  ERROR
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetState, setResetState] = useState<ResetState>(ResetState.INITIAL);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  useEffect(() => {
    // Check if passwords match
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }

    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password, confirmPassword]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch || password.length < 8) {
      return;
    }
    
    setResetState(ResetState.SUBMITTING);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      setResetState(ResetState.SUCCESS);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      setResetState(ResetState.ERROR);
      setErrorMessage(error.message || 'Failed to reset password. Please try again.');
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
              <h1 className="text-3xl font-bold">Reset Your Password</h1>
              <p className="text-white/60 mt-2">Choose a new, secure password for your account</p>
            </div>
            
            {resetState === ResetState.SUCCESS ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Password Updated!</h2>
                <p className="text-white/70 mb-6">Your password has been successfully reset.</p>
                <p className="text-white/70">Redirecting to login page...</p>
              </div>
            ) : resetState === ResetState.ERROR ? (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Something Went Wrong</h2>
                <p className="text-white/70 mb-6">{errorMessage}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setResetState(ResetState.INITIAL)}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="h-4 w-4 text-white/50" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
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
                        <div 
                          className={`h-full ${
                            passwordStrength === 0 ? "bg-red-500 w-1/4" :
                            passwordStrength === 1 ? "bg-orange-500 w-2/4" :
                            passwordStrength === 2 ? "bg-yellow-500 w-3/4" :
                            passwordStrength === 3 ? "bg-green-400 w-full" :
                            "bg-green-500 w-full"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label 
                    htmlFor="confirm-password" 
                    className={!passwordsMatch ? "text-red-400" : ""}
                  >
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
                  disabled={resetState === ResetState.SUBMITTING || !passwordsMatch || password.length < 8}
                >
                  {resetState === ResetState.SUBMITTING ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
