
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState = ({ isLoading }: LoadingStateProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex justify-center items-center py-32">
      <div className="w-12 h-12 border-4 border-elvis-pink/30 border-t-elvis-pink rounded-full animate-spin"></div>
    </div>
  );
};

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  if (!error) return null;
  
  return (
    <div className="text-center py-32">
      <h3 className="text-2xl font-bold text-white mb-4">Oops!</h3>
      <p className="text-white/70 mb-6">{error}</p>
      <Button 
        variant="outline" 
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
};
