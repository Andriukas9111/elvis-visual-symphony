
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

type AuthButtonProps = {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  defaultTab?: 'login' | 'register';
  onClick?: () => void;
};

const AuthButton = ({ 
  children, 
  variant = "default", 
  className = "", 
  defaultTab = 'login',
  onClick
}: AuthButtonProps) => {
  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(true);
    if (onClick) onClick();
  };
  
  return (
    <>
      <Button 
        variant={variant} 
        className={className} 
        onClick={handleClick}
      >
        {children || (defaultTab === 'login' ? 'Sign In' : 'Sign Up')}
      </Button>
      
      <AuthModal 
        open={open} 
        onOpenChange={setOpen} 
        defaultTab={defaultTab} 
      />
    </>
  );
};

export default AuthButton;
