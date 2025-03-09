
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Navigate } from 'react-router-dom';
import AuthButton from '@/components/AuthButton';
import { motion } from 'framer-motion';

const Auth = () => {
  const { user, profile } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-elvis-dark text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-0">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-elvis-magenta to-elvis-purple bg-clip-text text-transparent">
                Join Our Creative Community
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Sign up or log in to access exclusive content, save your favorite projects, and connect with other creatives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-elvis-medium border-none overflow-hidden">
                <CardHeader className="bg-elvis-light/50 pb-8">
                  <CardTitle className="text-2xl font-bold">New Here?</CardTitle>
                  <CardDescription className="text-white/70">
                    Create an account to access all features
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-elvis-pink mr-2"></div>
                      Access to premium content
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-elvis-pink mr-2"></div>
                      Save favorite projects
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-elvis-pink mr-2"></div>
                      Download resources
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-elvis-pink mr-2"></div>
                      Get personalized recommendations
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <AuthButton 
                    defaultTab="register" 
                    className="w-full sm:w-auto bg-elvis-gradient hover:opacity-90 transition-opacity"
                  >
                    Create Your Account
                  </AuthButton>
                </CardFooter>
              </Card>
              
              <Card className="bg-elvis-medium border-none overflow-hidden">
                <CardHeader className="bg-elvis-light/50 pb-8">
                  <CardTitle className="text-2xl font-bold">Already a Member?</CardTitle>
                  <CardDescription className="text-white/70">
                    Welcome back! Sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <p className="text-white/80 mb-6">
                    Sign in to access your profile, view your favorite projects, and continue where you left off.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <AuthButton 
                    defaultTab="login" 
                    className="w-full sm:w-auto bg-elvis-gradient hover:opacity-90 transition-opacity"
                  >
                    Sign In
                  </AuthButton>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
