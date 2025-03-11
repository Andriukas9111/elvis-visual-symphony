
import React from 'react';
import { Check } from 'lucide-react';

interface SavedIndicatorProps {
  lastSaved: Date | null;
}

const SavedIndicator: React.FC<SavedIndicatorProps> = ({ lastSaved }) => {
  if (!lastSaved) return null;
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <div className="flex items-center text-green-500 text-sm">
      <Check className="w-4 h-4 mr-1" />
      <span>Saved at {formatTime(lastSaved)}</span>
    </div>
  );
};

export default SavedIndicator;
