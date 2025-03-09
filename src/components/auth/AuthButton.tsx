
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { Slot } from '@radix-ui/react-slot';

type AuthButtonProps = {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  defaultTab?: 'login' | 'register';
  onClick?: () => void;
  asChild?: boolean;
};

const AuthButton = ({ 
  children, 
  variant = "default", 
  className = "", 
  defaultTab = 'login',
  onClick,
  asChild = false
}: AuthButtonProps) => {
  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(true);
    if (onClick) onClick();
  };
  
  const Comp = asChild ? Slot : "div";
  
  return (
    <>
      <Comp>
        <Button 
          variant={variant} 
          className={className} 
          onClick={handleClick}
        >
          {children || (defaultTab === 'login' ? 'Sign In' : 'Sign Up')}
        </Button>
      </Comp>
      
      <AuthModal 
        open={open} 
        onOpenChange={setOpen} 
        defaultTab={defaultTab} 
      />
    </>
  );
};

export default AuthButton;
