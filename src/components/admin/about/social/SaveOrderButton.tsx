
import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveOrderButtonProps {
  isSaving: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SaveOrderButton: React.FC<SaveOrderButtonProps> = ({ isSaving, onClick, disabled = false }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || isSaving}
      className="w-full mt-6"
    >
      {isSaving ? 'Saving...' : 'Save Platforms'}
    </Button>
  );
};

export default SaveOrderButton;
