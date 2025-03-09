
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}

const AuthButton = ({ 
  children, 
  className = '',
  asChild = false,
  onClick
}: AuthButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to login page instead of showing modal
      navigate('/login');
    }
  };

  if (asChild) {
    return (
      <Button 
        className={className} 
        onClick={handleClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
