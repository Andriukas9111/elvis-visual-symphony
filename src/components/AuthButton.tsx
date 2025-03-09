
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

type AuthButtonProps = {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  defaultTab?: 'login' | 'register';
  children?: React.ReactNode;
};

const AuthButton = ({ 
  className, 
  variant = 'default', 
  defaultTab = 'login',
  children = defaultTab === 'login' ? 'Sign In' : 'Sign Up'
}: AuthButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  if (user) {
    // Return null if user is already logged in
    return null;
  }

  return (
    <>
      <Button 
        variant={variant} 
        className={className} 
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </Button>
      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        defaultTab={defaultTab}
      />
    </>
  );
};

export default AuthButton;
