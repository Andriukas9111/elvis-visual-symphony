
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SavedConfirmationProps {
  lastSaveTime: string;
}

const SavedConfirmation: React.FC<SavedConfirmationProps> = ({ lastSaveTime }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [lastSaveTime]);

  if (!isVisible) return null;

  return (
    <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3 flex items-center animate-in fade-in slide-in-from-top-5 duration-500">
      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
      <p className="text-green-200 text-sm font-medium">
        Changes saved successfully at {lastSaveTime}
      </p>
    </div>
  );
};

export default SavedConfirmation;
